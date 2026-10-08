import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateRentalAgreementPdf(
  pagesContainerSelector: string = '.agreement-document-wrapper',
  filename: string = 'Tamil_Nadu_Rental_Agreement.pdf',
  onProgress?: (progressText: string) => void
): Promise<void> {
  const container = document.querySelector(pagesContainerSelector);
  if (!container) {
    throw new Error('Agreement container not found');
  }

  const pageElements = container.querySelectorAll<HTMLElement>('.agreement-page');
  if (!pageElements || pageElements.length === 0) {
    throw new Error('No agreement pages found to render');
  }

  onProgress?.('Generating PDF (Page 1 of 3)...');

  // Create A4 PDF (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  for (let i = 0; i < pageElements.length; i++) {
    onProgress?.(`Rendering Page ${i + 1} of ${pageElements.length}...`);
    const pageEl = pageElements[i];

    // High quality canvas render
    const canvas = await html2canvas(pageEl, {
      scale: 2, // 2x resolution for crisp, sharp text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  onProgress?.('Saving PDF...');
  pdf.save(filename);
}
