// ============================================
// DOCUMENT TEMPLATES - Templates de documentos (PDF, Certificados, etc)
// ============================================

import type { Aluno, Professor } from '../types';

/**
 * Interface para dados de um documento
 */
export interface DocumentData {
  type: 'declaracao' | 'certificado' | 'historico' | 'comprovante';
  recipient: Aluno | Professor;
  course?: string;
  issueDate: Date;
  customData?: Record<string, any>;
}

/**
 * Gera HTML para declaração de matrícula
 */
export function generateDeclaracaoMatricula(aluno: Aluno, curso: string): string {
  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 2cm; }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.8;
          color: #000;
          text-align: justify;
        }
        .header {
          text-align: center;
          margin-bottom: 50px;
        }
        .logo {
          font-size: 20pt;
          font-weight: bold;
          color: #2563eb;
        }
        .subtitle {
          font-size: 10pt;
          color: #666;
        }
        .title {
          text-align: center;
          font-size: 16pt;
          font-weight: bold;
          margin: 40px 0;
          text-transform: uppercase;
        }
        .content {
          text-indent: 2cm;
          margin: 30px 0;
        }
        .signature {
          margin-top: 80px;
          text-align: center;
        }
        .signature-line {
          border-top: 1px solid #000;
          width: 300px;
          margin: 0 auto;
          padding-top: 10px;
        }
        .footer {
          margin-top: 50px;
          font-size: 9pt;
          text-align: center;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SABIENCIA</div>
        <div class="subtitle">Escola Técnica de Enfermagem</div>
        <div class="subtitle">CNPJ: 12.345.678/0001-90</div>
      </div>

      <div class="title">Declaração de Matrícula</div>

      <div class="content">
        <p>
          Declaramos para os devidos fins que <strong>${aluno.nome_completo}</strong>,
          portador(a) do CPF nº <strong>${formatCPF(aluno.cpf)}</strong>,
          RG nº <strong>${aluno.rg || 'não informado'}</strong>,
          nascido(a) em <strong>${formatDate(new Date(aluno.data_nascimento))}</strong>,
          encontra-se devidamente matriculado(a) no curso de 
          <strong>${curso}</strong>, nesta instituição de ensino.
        </p>

        <p>
          A presente declaração é válida para fins de comprovação de vínculo estudantil,
          podendo ser utilizada junto a órgãos públicos e privados.
        </p>
      </div>

      <div class="content" style="text-align: right; margin-top: 40px;">
        <p>São Paulo, ${hoje}.</p>
      </div>

      <div class="signature">
        <div class="signature-line">
          Sabiencia<br>
          Direção Acadêmica
        </div>
      </div>

      <div class="footer">
        <p>
          Rua Exemplo, 123 - Centro - São Paulo/SP - CEP 01234-567<br>
          Telefone: (11) 1234-5678 | Email: contato@sabiencia.com.br
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Gera HTML para certificado de conclusão
 */
export function generateCertificadoConclusao(
  aluno: Aluno,
  curso: string,
  dataConclusao: Date,
  cargaHoraria: number
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4 landscape; margin: 1cm; }
        body {
          font-family: 'Georgia', serif;
          color: #000;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 40px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .certificate {
          background: white;
          padding: 60px;
          border: 20px solid #2563eb;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          max-width: 900px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .logo {
          font-size: 32pt;
          font-weight: bold;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .subtitle {
          font-size: 14pt;
          color: #666;
          margin-top: 10px;
        }
        .title {
          text-align: center;
          font-size: 36pt;
          font-weight: bold;
          color: #2563eb;
          margin: 40px 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .content {
          text-align: center;
          font-size: 14pt;
          line-height: 2;
          margin: 40px 0;
        }
        .recipient-name {
          font-size: 24pt;
          font-weight: bold;
          color: #1e40af;
          margin: 20px 0;
          text-decoration: underline;
        }
        .course-name {
          font-size: 18pt;
          font-weight: bold;
          color: #2563eb;
          margin: 20px 0;
        }
        .signatures {
          display: flex;
          justify-content: space-around;
          margin-top: 80px;
        }
        .signature-box {
          text-align: center;
        }
        .signature-line {
          border-top: 2px solid #000;
          width: 250px;
          padding-top: 10px;
          font-size: 11pt;
        }
        .seal {
          position: absolute;
          bottom: 60px;
          left: 60px;
          width: 100px;
          height: 100px;
          border: 3px solid #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8pt;
          text-align: center;
          color: #2563eb;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="logo">Sabiencia</div>
          <div class="subtitle">Escola Técnica de Enfermagem</div>
        </div>

        <div class="title">Certificado</div>

        <div class="content">
          <p>Certificamos que</p>
          
          <div class="recipient-name">${aluno.nome_completo}</div>
          
          <p>
            Portador(a) do CPF nº ${formatCPF(aluno.cpf)},<br>
            concluiu com êxito o curso de
          </p>
          
          <div class="course-name">${curso}</div>
          
          <p>
            com carga horária total de <strong>${cargaHoraria} horas</strong>,<br>
            no dia <strong>${formatDate(dataConclusao)}</strong>.
          </p>
        </div>

        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">
              Diretor(a) Acadêmico(a)
            </div>
          </div>
          <div class="signature-box">
            <div class="signature-line">
              Coordenador(a) do Curso
            </div>
          </div>
        </div>

        <div class="seal">
          SELO<br>OFICIAL
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Gera HTML para histórico escolar
 */
export function generateHistoricoEscolar(
  aluno: Aluno,
  curso: string,
  notas: Array<{
    disciplina: string;
    av1: number;
    av2: number;
    media: number;
    situacao: string;
    cargaHoraria: number;
  }>
): string {
  const mediaGeral = notas.reduce((sum, n) => sum + n.media, 0) / notas.length;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 2cm; }
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          color: #000;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 18pt;
          font-weight: bold;
          color: #2563eb;
        }
        .title {
          font-size: 14pt;
          font-weight: bold;
          margin: 20px 0;
        }
        .student-info {
          margin: 20px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .info-row {
          margin: 5px 0;
        }
        .info-label {
          font-weight: bold;
          display: inline-block;
          width: 150px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 9pt;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #2563eb;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .numeric {
          text-align: center;
        }
        .summary {
          margin-top: 30px;
          padding: 15px;
          background-color: #f3f4f6;
          border-radius: 5px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 8pt;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SABIENCIA</div>
        <div>Escola Técnica de Enfermagem</div>
        <div class="title">HISTÓRICO ESCOLAR</div>
      </div>

      <div class="student-info">
        <div class="info-row">
          <span class="info-label">Nome:</span>
          ${aluno.nome_completo}
        </div>
        <div class="info-row">
          <span class="info-label">CPF:</span>
          ${formatCPF(aluno.cpf)}
        </div>
        <div class="info-row">
          <span class="info-label">RG:</span>
          ${aluno.rg || 'Não informado'}
        </div>
        <div class="info-row">
          <span class="info-label">Data de Nascimento:</span>
          ${formatDate(new Date(aluno.data_nascimento))}
        </div>
        <div class="info-row">
          <span class="info-label">Curso:</span>
          ${curso}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th class="numeric">AV1</th>
            <th class="numeric">AV2</th>
            <th class="numeric">Média</th>
            <th class="numeric">C.H.</th>
            <th class="numeric">Situação</th>
          </tr>
        </thead>
        <tbody>
          ${notas.map(nota => `
            <tr>
              <td>${nota.disciplina}</td>
              <td class="numeric">${nota.av1.toFixed(1)}</td>
              <td class="numeric">${nota.av2.toFixed(1)}</td>
              <td class="numeric"><strong>${nota.media.toFixed(1)}</strong></td>
              <td class="numeric">${nota.cargaHoraria}h</td>
              <td class="numeric">${nota.situacao}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="summary">
        <strong>Média Geral:</strong> ${mediaGeral.toFixed(2)}<br>
        <strong>Carga Horária Total:</strong> ${notas.reduce((sum, n) => sum + n.cargaHoraria, 0)} horas<br>
        <strong>Situação Geral:</strong> ${mediaGeral >= 7 ? 'APROVADO' : 'REPROVADO'}
      </div>

      <div class="footer">
        <p>
          Documento gerado em ${new Date().toLocaleString('pt-BR')}<br>
          Este documento tem validade sem assinatura por ter sido gerado eletronicamente
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Gera HTML para comprovante de pagamento
 */
export function generateComprovantePagamento(data: {
  aluno: Aluno;
  descricao: string;
  valor: number;
  dataPagamento: Date;
  formaPagamento: string;
  numeroRecibo: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 1.5cm; }
        body {
          font-family: Arial, sans-serif;
          font-size: 11pt;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 20pt;
          font-weight: bold;
          color: #2563eb;
        }
        .recibo-number {
          font-size: 14pt;
          color: #666;
          margin: 10px 0;
        }
        .content {
          margin: 30px 0;
        }
        .info-box {
          border: 1px solid #ddd;
          padding: 15px;
          margin: 15px 0;
          background-color: #f9fafb;
          border-radius: 5px;
        }
        .info-row {
          margin: 10px 0;
          display: flex;
        }
        .label {
          font-weight: bold;
          width: 200px;
        }
        .value {
          flex: 1;
        }
        .valor-destaque {
          font-size: 18pt;
          color: #059669;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          background-color: #f0fdf4;
          border: 2px solid #059669;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 50px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          text-align: center;
          font-size: 9pt;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SABIENCIA</div>
        <div class="recibo-number">RECIBO Nº ${data.numeroRecibo}</div>
      </div>

      <div class="content">
        <div class="info-box">
          <div class="info-row">
            <span class="label">Recebemos de:</span>
            <span class="value">${data.aluno.nome_completo}</span>
          </div>
          <div class="info-row">
            <span class="label">CPF:</span>
            <span class="value">${formatCPF(data.aluno.cpf)}</span>
          </div>
        </div>

        <div class="valor-destaque">
          R$ ${data.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>

        <div class="info-box">
          <div class="info-row">
            <span class="label">Referente a:</span>
            <span class="value">${data.descricao}</span>
          </div>
          <div class="info-row">
            <span class="label">Forma de Pagamento:</span>
            <span class="value">${data.formaPagamento}</span>
          </div>
          <div class="info-row">
            <span class="label">Data do Pagamento:</span>
            <span class="value">${formatDate(data.dataPagamento)}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>
          Sabiencia - CNPJ: 12.345.678/0001-90<br>
          Rua Exemplo, 123 - Centro - São Paulo/SP<br>
          Telefone: (11) 1234-5678 | Email: financeiro@sabiencia.com.br<br><br>
          Documento gerado eletronicamente em ${new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Converte HTML para Blob (para download)
 */
export function htmlToBlob(html: string): Blob {
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

/**
 * Baixa documento HTML
 */
export function downloadDocument(html: string, filename: string): void {
  const blob = htmlToBlob(html);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Abre documento em nova janela para impressão
 */
export function printDocument(html: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

// Funções auxiliares de formatação
function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
