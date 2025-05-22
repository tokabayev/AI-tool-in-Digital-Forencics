from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os
from collections import Counter
from textwrap import wrap
import re
import matplotlib
import uuid
import platform
import logging

matplotlib.use('Agg')
import matplotlib.pyplot as plt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TEMP_DIR = "temp"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

pdfmetrics.registerFont(TTFont('DejaVuSerif', 'DejaVuSerif.ttf'))
DEFAULT_FONT = 'DejaVuSerif'

def load_stop_words_from_file(filepath: str = os.path.join(os.path.dirname(__file__), "stopwords.txt")) -> set[str]:
    logger.info(f"Попытка загрузки стоп-слов из: {filepath}")
    if not os.path.exists(filepath):
        logger.error(f"Файл стоп-слов не найден: {filepath}")
        return set()
    with open(filepath, "r", encoding="utf-8") as f:
        return set(line.strip().lower() for line in f if line.strip())

STOP_WORDS = load_stop_words_from_file()

def generate_word_frequency_chart(transcription, output_path):
    words = [word.lower() for word in re.findall(r'\b\w+\b', transcription)
             if word.isalpha() and word.lower() not in STOP_WORDS]
    word_freq = Counter(words).most_common(10)
    if not word_freq:
        return False
    words, counts = zip(*word_freq)
    plt.figure(figsize=(8, 4))
    plt.bar(words, counts, color='skyblue')
    plt.title('Top 10 Frequent Words (Excluding Common Words)')
    plt.xlabel('Words')
    plt.ylabel('Frequency')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()
    return True

def extract_text_insights(transcription):
    words = [word.lower() for word in re.findall(r'\b\w+\b', transcription)
             if word.isalpha() and word.lower() not in STOP_WORDS]
    frequent_words = Counter(words).most_common(5)
    bigrams = [(words[i], words[i + 1]) for i in range(len(words) - 1)] if len(words) > 1 else []
    key_phrases = [' '.join(bigram) for bigram, _ in Counter(bigrams).most_common(5)] if bigrams else []
    names = []
    sentences = re.split(r'[.!?]\s+', transcription)
    for sentence in sentences:
        ws = sentence.split()
        for i, word in enumerate(ws[1:], 1):
            if word and word[0].isupper() and word.isalpha():
                names.append(word)
    names = list(dict.fromkeys(names))[:5]
    return {"frequent_words": frequent_words, "key_phrases": key_phrases, "names": names}

def generate_pdf_report(analysis_result, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=0.5 * inch, leftMargin=0.5 * inch, topMargin=0.5 * inch, bottomMargin=0.5 * inch)
    elements = []
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(name='TitleStyle', parent=styles['Heading1'], fontName=DEFAULT_FONT, fontSize=18, spaceAfter=12, textColor=colors.white, backColor=colors.HexColor('#004aad'), padding=6, borderPadding=6, alignment=1)
    body_style = ParagraphStyle(name='BodyStyle', parent=styles['Normal'], fontName=DEFAULT_FONT, fontSize=10, spaceAfter=6, leading=12)
    table_header_style = ParagraphStyle(name='TableHeaderStyle', parent=styles['Normal'], fontName=DEFAULT_FONT, fontSize=10, textColor=colors.white)
    elements.append(Paragraph("Media Analysis Report", title_style))
    elements.append(Paragraph(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", styles['Normal']))
    elements.append(Spacer(1, 0.25 * inch))

    if "error" in analysis_result:
        elements.append(Paragraph(f"Error: {analysis_result['error']}", body_style))
        doc.build(elements)
        return

    elements.append(Paragraph("Transcription", styles['Heading2']))
    transcription = analysis_result.get("transcription") or "Transcription not available"
    wrapped_paragraphs = wrap(transcription, 100)
    for part in wrapped_paragraphs:
        elements.append(Paragraph(part, body_style))
        elements.append(Spacer(1, 0.1 * inch))

    chart_filename = f"word_freq_chart_{uuid.uuid4().hex}.png"
    chart_path = os.path.join(TEMP_DIR, chart_filename)
    chart_created = generate_word_frequency_chart(transcription, chart_path)
    if chart_created and os.path.exists(chart_path):
        elements.append(Paragraph("Word Frequency Analysis", styles['Heading2']))
        elements.append(Image(chart_path, width=6 * inch, height=3 * inch))
        elements.append(Spacer(1, 0.25 * inch))

    text_insights = extract_text_insights(transcription)

    elements.append(Paragraph("Key Phrases", styles['Heading2']))
    if text_insights["key_phrases"]:
        for phrase in text_insights["key_phrases"]:
            elements.append(Paragraph(phrase, body_style))
    else:
        elements.append(Paragraph("No key phrases found.", body_style))
    elements.append(Spacer(1, 0.25 * inch))

    elements.append(Paragraph("Detected Names", styles['Heading2']))
    if text_insights["names"]:
        for name in text_insights["names"]:
            elements.append(Paragraph(name, body_style))
    else:
        elements.append(Paragraph("No names detected.", body_style))
    elements.append(Spacer(1, 0.25 * inch))

    elements.append(Paragraph("Drug-Related Timestamps", styles['Heading2']))
    timestamps = analysis_result.get("drug_timestamps", [])
    if not timestamps:
        elements.append(Paragraph("No timestamps found.", body_style))
    else:
        table_data = [[Paragraph("Timestamp (s)", table_header_style), Paragraph("Text", table_header_style)]]
        for timestamp in timestamps:
            table_data.append([f"{timestamp['timestamp']:.2f}", Paragraph(timestamp['text'][:200], body_style)])
        table = Table(table_data, colWidths=[1.5 * inch, 5 * inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#004aad')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), DEFAULT_FONT),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f5f5f5')),
        ]))
        elements.append(table)

    def add_page_number(canvas, doc):
        page_num = canvas.getPageNumber()
        text = f"Page {page_num}"
        canvas.setFont(DEFAULT_FONT, 9)
        canvas.setFillColor(colors.grey)
        canvas.drawRightString(doc.rightMargin + doc.width, 0.25 * inch, text)

    doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number)
    if chart_created and os.path.exists(chart_path):
        os.remove(chart_path)