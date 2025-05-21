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

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from wordcloud import STOPWORDS
import logging
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TEMP_DIR = "temp"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

pdfmetrics.registerFont(TTFont('DejaVuSans', 'ttf/DejaVuSans.ttf'))

def generate_word_frequency_chart(transcription: str, output_path: str):
    words = [word.lower() for word in re.findall(r'\b\w+\b', transcription) if word.isalpha()]
    words = [word for word in words if word not in STOPWORDS]
    word_freq = Counter(words).most_common(10)

    if not word_freq:
        logger.warning("No words found for frequency chart")
        return False

    words, counts = zip(*word_freq)
    plt.figure(figsize=(8, 4))
    plt.bar(words, counts, color='skyblue')
    plt.title('Top 10 Frequent Words')
    plt.xlabel('Words')
    plt.ylabel('Frequency')
    plt.xticks(rotation=45)
    plt.tight_layout()
    try:
        plt.savefig(output_path)
        logger.info(f"Chart saved to {output_path}")
        plt.close()
        return True
    except Exception as e:
        logger.error(f"Failed to save chart: {str(e)}")
        plt.close()
        return False

def extract_text_insights(transcription: str):
    words = [word.lower() for word in re.findall(r'\b\w+\b', transcription) if word.isalpha()]
    words = [word for word in words if word not in STOPWORDS]
    frequent_words = Counter(words).most_common(5)

    bigrams = [(words[i], words[i + 1]) for i in range(len(words) - 1)] if len(words) > 1 else []
    key_phrases = [' '.join(bigram[0]) for bigram in Counter(bigrams).most_common(5)] if bigrams else []

    names = []
    sentences = re.split(r'[.!?]\s+', transcription)
    for sentence in sentences:
        words = sentence.split()
        for i, word in enumerate(words[1:], 1):
            if word and word[0].isupper() and word.isalpha():
                names.append(word)
    names = list(dict.fromkeys(names))[:5]

    return {
        "frequent_words": frequent_words,
        "key_phrases": key_phrases,
        "names": names
    }

def generate_pdf_report(analysis_result: dict, output_path: str):
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=0.5 * inch, leftMargin=0.5 * inch,
                            topMargin=0.5 * inch, bottomMargin=0.5 * inch)
    elements = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        name='TitleStyle',
        parent=styles['Heading1'],
        fontName='DejaVuSans',
        fontSize=18,
        spaceAfter=12,
        textColor=colors.white,
        backColor=colors.HexColor('#004aad'),
        padding=6,
        borderPadding=6,
        alignment=1
    )
    subtitle_style = ParagraphStyle(
        name='SubtitleStyle',
        parent=styles['Normal'],
        fontName='DejaVuSans',
        fontSize=12,
        spaceAfter=8,
        textColor=colors.grey
    )
    body_style = ParagraphStyle(
        name='BodyStyle',
        parent=styles['Normal'],
        fontName='DejaVuSans',
        fontSize=10,
        spaceAfter=6,
        leading=12
    )
    table_header_style = ParagraphStyle(
        name='TableHeaderStyle',
        parent=styles['Normal'],
        fontName='DejaVuSans',
        fontSize=10,
        textColor=colors.white
    )

    elements.append(Paragraph("Media Analysis Report", title_style))
    elements.append(Paragraph(
        f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}",
        subtitle_style
    ))
    elements.append(Spacer(1, 0.25 * inch))

    if "error" in analysis_result:
        elements.append(Paragraph(f"Error: {analysis_result['error']}", body_style))
        doc.build(elements)
        return

    elements.append(Paragraph("Transcription", styles['Heading2']))
    transcription = analysis_result.get("transcription") or "Transcription not available"
    wrapped_paragraphs = wrap(transcription, 1000)
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
    else:
        elements.append(Paragraph("Word frequency chart not generated: insufficient data or error.", body_style))
        logger.warning("Chart not included in report")

    text_insights = extract_text_insights(transcription)

    elements.append(Paragraph("Frequent Words", styles['Heading2']))
    if text_insights["frequent_words"]:
        table_data = [[Paragraph("Word", table_header_style), Paragraph("Count", table_header_style)]]
        for word, count in text_insights["frequent_words"]:
            table_data.append([word, str(count)])
        table = Table(table_data, colWidths=[3 * inch, 3 * inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#004aad')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f5f5f5')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#e8ecef')]),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(table)
    else:
        elements.append(Paragraph("No frequent words found.", body_style))
    elements.append(Spacer(1, 0.25 * inch))

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
        table_data = [[
            Paragraph("Timestamp (s)", table_header_style),
            Paragraph("Text", table_header_style)
        ]]
        for timestamp in timestamps:
            table_data.append([
                f"{timestamp['timestamp']:.2f}",
                Paragraph(timestamp['text'][:200], body_style)
            ])
        table = Table(table_data, colWidths=[1.5 * inch, 5 * inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#004aad')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f5f5f5')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BOX', (0, 0), (-1, -1), 1, colors.black),
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#e8ecef')]),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(table)

    def add_page_number(canvas, doc):
        page_num = canvas.getPageNumber()
        text = f"Page {page_num}"
        canvas.setFont("DejaVuSans", 9)
        canvas.setFillColor(colors.grey)
        canvas.drawRightString(doc.rightMargin + doc.width, 0.25 * inch, text)

    doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number)

    if chart_created and os.path.exists(chart_path):
        try:
            os.remove(chart_path)
            logger.info(f"Chart file {chart_path} removed")
        except Exception as e:
            logger.error(f"Failed to remove chart file {chart_path}: {str(e)}")