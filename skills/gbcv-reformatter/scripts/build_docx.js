#!/usr/bin/env node
/**
 * GBCV Document Builder v3
 */
const fs = require('fs');
const path = require('path');
try { require.resolve('docx'); } catch(e) {
  require('child_process').execSync('npm install -g docx', { stdio: 'inherit' });
}
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, BorderStyle,
  WidthType, ShadingType, PageBreak, LevelFormat, SectionType,
} = require('docx');

const dataFile = process.argv[2];
if (!dataFile) { console.error('Usage: node build_docx.js <data.json>'); process.exit(1); }
const payload = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const { cv_data, prepared_by, date, output_path, logo_path } = payload;
const SKILL_ASSETS = path.join(__dirname, '..', 'assets');

const NAVY='1c2033', BLUE_LIGHT='9cc7ee', BLUE_BG='dce9f5';
const GREY_DARK='464646', GREY_MID='686868';
const LATO='Lato', LATO_BLACK='Lato Black';
const PAGE_W=11906, PAGE_H=16838, MAR_L=1134, MAR_R=1134, MAR_T=2552, MAR_B=1418;
const CONT_W=PAGE_W-MAR_L-MAR_R; // 9638

// Experience table columns
const COL_LABEL=1440, COL_MAIN=6758, COL_DATES=1440;
const EXP_W=COL_LABEL+COL_MAIN+COL_DATES; // 9638

const NO_BORDER={style:BorderStyle.NONE,size:0,color:'FFFFFF'};
const THIN_H={style:BorderStyle.SINGLE,size:4,color:BLUE_LIGHT,space:0};
const TBL_NO={
  top:{style:BorderStyle.NONE,size:0},bottom:{style:BorderStyle.NONE,size:0},
  left:{style:BorderStyle.NONE,size:0},right:{style:BorderStyle.NONE,size:0},
  insideH:{style:BorderStyle.NONE,size:0},insideV:{style:BorderStyle.NONE,size:0}
};

// ── Images ──────────────────────────────────────────────────────────
function logoRun(){
  return new ImageRun({
    data: fs.readFileSync(logo_path),
    transformation: { width: 179, height: 47 },
    type: 'png',
  });
}

function crestRun(){
  // Full-page-width crest: 8.268in wide x 6.535in tall, vertically centered on A4
  // 7in wide x 5.53in tall, centered: X=0.635in, Y=3.08in from page top-left
  return new ImageRun({
    data: fs.readFileSync(path.join(SKILL_ASSETS, 'crest_watermark.png')),
    transformation: { width: 793, height: 627 }, // full page width at 96dpi
    type: 'png',
    floating: {
      horizontalPosition: { relative: 'page', offset: 0 },
      verticalPosition:   { relative: 'page', offset: 2356853 },
      wrap: { type: 'none' },
      behindDocument: true,
      allowOverlap: true,
      layoutInCell: true,
      lockAnchor: false,
    },
  });
}

// ── Text helpers ─────────────────────────────────────────────────────
function r(text, opts={}){
  return new TextRun({
    text, font: opts.bold ? LATO_BLACK : LATO,
    size: opts.size||22, color: opts.color||'000000',
    smallCaps: opts.smallCaps||false, bold: false,
    italics: opts.italic||false,
  });
}
function emptyP(b,a){ return new Paragraph({children:[],spacing:{before:b||0,after:a||0}}); }

function sectionH(text){
  return new Paragraph({
    children:[r(text,{size:28,color:NAVY,bold:true})],
    spacing:{before:320,after:160},
    border:{bottom:{style:BorderStyle.SINGLE,size:12,color:BLUE_LIGHT,space:6}},
  });
}
function flagP(text){
  return new Paragraph({
    children:[r('\u26A0 '+text,{color:'7B5800',bold:true})],
    spacing:{before:80,after:80},
    shading:{fill:'FFF3CD',type:ShadingType.CLEAR},
  });
}

// ── Cover page ───────────────────────────────────────────────────────
function buildCoverChildren(name, preparedBy, dateStr){
  return [
    // Crest sits behind everything as floating image
    new Paragraph({ children:[crestRun()], spacing:{before:0,after:0} }),
    emptyP(2400,0),
    new Paragraph({ children:[r('Confidential CV',{size:48,color:NAVY,bold:true})], spacing:{before:0,after:0} }),
    new Paragraph({ children:[r(name,{size:48,color:NAVY,bold:true})], spacing:{before:0,after:0} }),
    emptyP(2200,0),
    new Paragraph({ children:[r('Prepared by: '+preparedBy,{size:24,color:GREY_DARK,smallCaps:true})], spacing:{before:80,after:40} }),
    new Paragraph({ children:[r('Date: '+dateStr,{size:24,color:GREY_DARK,smallCaps:true})], spacing:{before:40,after:0} }),
  ];
}

// ── Experience table ─────────────────────────────────────────────────
// Structure:
//   Row 1 (DATE):    full-width, blue-bg, no borders
//   Row 2 (COMPANY): light-blue-bg, thin top border, 3 cols
//   Row 3 (TITLE):   light-blue-bg, thin top border, 3 cols
//   Then: bold role heading + blue-dot bullets
function buildExpTable(emp){
  const rows=[];

  // Row 1 — Date range: full width, blue background, no borders
  rows.push(new TableRow({ children:[
    new TableCell({
      columnSpan:3,
      width:{size:EXP_W,type:WidthType.DXA},
      shading:{fill:BLUE_BG,type:ShadingType.CLEAR},
      margins:{top:80,bottom:80,left:120,right:120},
      borders:{top:NO_BORDER,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
      children:[new Paragraph({
        children:[r(emp.date_range||'',{size:20,color:GREY_DARK,smallCaps:true})],
        spacing:{before:0,after:0},
      })],
    }),
  ]}));

  // Row 2 — Company: blue-bg, thin horizontal line on top
  rows.push(new TableRow({ children:[
    new TableCell({
      width:{size:COL_LABEL,type:WidthType.DXA},
      shading:{fill:BLUE_BG,type:ShadingType.CLEAR},
      margins:{top:60,bottom:60,left:120,right:80},
      borders:{top:THIN_H,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
      children:[new Paragraph({
        children:[r('Company:',{size:20,color:GREY_DARK,smallCaps:true})],
        spacing:{before:0,after:0},
      })],
    }),
    new TableCell({
      columnSpan:2,
      width:{size:COL_MAIN+COL_DATES,type:WidthType.DXA},
      shading:{fill:'FFFFFF',type:ShadingType.CLEAR},
      margins:{top:60,bottom:60,left:0,right:120},
      borders:{top:THIN_H,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
      children:[new Paragraph({
        children:[r(emp.company||'',{size:22})],
        spacing:{before:0,after:0},
      })],
    }),
  ]}));

  // Row 3 — Title(s): blue-bg, thin horizontal line on top
  if(emp.roles && emp.roles.length>0){
    const titlePs=emp.roles.map(ro=>new Paragraph({
      children:[r(ro.title||'',{size:20,color:GREY_DARK,smallCaps:true})],
      spacing:{before:20,after:20},
    }));
    const datePs=emp.roles.map(ro=>{
      const d=ro.end_date?`${ro.start_date||''} \u2013 ${ro.end_date}`:(ro.start_date||'');
      return new Paragraph({
        children:[r(d,{size:20})],
        alignment:AlignmentType.RIGHT,
        spacing:{before:20,after:20},
      });
    });
    rows.push(new TableRow({ children:[
      new TableCell({
        width:{size:COL_LABEL,type:WidthType.DXA},
        shading:{fill:BLUE_BG,type:ShadingType.CLEAR},
        margins:{top:60,bottom:60,left:120,right:80},
        borders:{top:THIN_H,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
        children:[new Paragraph({
          children:[r('Title:',{size:20,color:GREY_DARK,smallCaps:true})],
          spacing:{before:0,after:0},
        })],
      }),
      new TableCell({
        width:{size:COL_MAIN,type:WidthType.DXA},
        shading:{fill:'FFFFFF',type:ShadingType.CLEAR},
        margins:{top:60,bottom:60,left:0,right:0},
        borders:{top:THIN_H,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
        children:titlePs,
      }),
      new TableCell({
        width:{size:COL_DATES,type:WidthType.DXA},
        shading:{fill:'FFFFFF',type:ShadingType.CLEAR},
        margins:{top:60,bottom:60,left:40,right:120},
        borders:{top:THIN_H,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
        children:datePs,
      }),
    ]}));
  }

  const tbl=new Table({
    width:{size:EXP_W,type:WidthType.DXA},
    columnWidths:[COL_LABEL,COL_MAIN,COL_DATES],
    borders:TBL_NO,
    rows,
  });

  // Role bullet sections below the table
  const extras=[];
  if(emp.roles){
    emp.roles.forEach(ro=>{
      if(!ro.bullets||ro.bullets.length===0) return;
      extras.push(new Paragraph({
        children:[r(ro.title||'',{size:22,bold:true})],
        spacing:{before:140,after:60},
      }));
      ro.bullets.forEach(b=>extras.push(new Paragraph({
        numbering:{reference:'gbBullets',level:0},
        children:[r(b,{size:22})],
        spacing:{before:40,after:40},
      })));
    });
  }
  return [tbl,...extras];
}

// ── Education ────────────────────────────────────────────────────────
function buildEduItems(education,missing){
  if(missing||!education||education.length===0) return [flagP('[EDUCATION \u2014 none provided]')];
  return education.flatMap(edu=>[
    new Paragraph({children:[r(edu.institution||'',{size:22,bold:true,color:NAVY})],spacing:{before:80,after:20}}),
    new Paragraph({
      children:[
        r([edu.degree,edu.field].filter(Boolean).join(' \u2014 '),{size:22}),
        ...(edu.year?[r('  '+edu.year,{size:20,color:GREY_DARK,italic:true})]:[]),
      ],spacing:{before:0,after:80},
    }),
  ]);
}

// ── Awards ───────────────────────────────────────────────────────────
function buildAwardsItems(awards,missing){
  if(missing||!awards||awards.length===0) return [flagP('[AWARDS & CERTIFICATIONS \u2014 none provided]')];
  return awards.map(a=>new Paragraph({
    children:[
      r(a.title||'',{size:22,bold:true,color:NAVY}),
      ...((a.issuer||a.year)?[r('  '+[a.issuer,a.year].filter(Boolean).join(', '),{size:22,color:GREY_DARK})]:[]),
    ],spacing:{before:80,after:40},
  }));
}

// ── Additional info ──────────────────────────────────────────────────
function buildAddlItems(additional){
  if(!additional||additional.length===0){
    return [new Paragraph({
      children:[r('[Recruiter: Add additional valuable information here or remove this section]',{size:22,color:GREY_MID,italic:true})],
      spacing:{before:80,after:80},
    })];
  }
  return additional.map(item=>new Paragraph({
    numbering:{reference:'gbBullets',level:0},
    children:[r(item,{size:22})],
    spacing:{before:40,after:40},
  }));
}

// ── Header ───────────────────────────────────────────────────────────
function buildHeader(){
  return new Header({ children:[new Paragraph({
    children:[logoRun()],
    alignment:AlignmentType.RIGHT,
    spacing:{before:0,after:0},
  })]});
}

// ── Footer ───────────────────────────────────────────────────────────
function buildFooter(withAddresses){
  const children=[];

  if(withAddresses){
    // Two-column address block using tab stop for right-side column
    children.push(new Paragraph({
      children:[
        r('Americas Head Office',{size:18,bold:true}),
      ],
      spacing:{before:0,after:0},
    }));
    children.push(new Paragraph({
      children:[r('33 W 60th St. Suite 201',{size:18,color:GREY_MID})],
      spacing:{before:0,after:0},
    }));
    children.push(new Paragraph({
      children:[r('New York, New York 10023',{size:18,color:GREY_MID})],
      spacing:{before:0,after:80},
    }));
    // Use a two-column table for the address layout (left + right)
    // Actually build as a proper side-by-side table
    const addrTable=new Table({
      width:{size:CONT_W,type:WidthType.DXA},
      columnWidths:[CONT_W/2, CONT_W/2],
      borders:TBL_NO,
      rows:[new TableRow({ children:[
        new TableCell({
          width:{size:CONT_W/2,type:WidthType.DXA},
          borders:{top:NO_BORDER,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
          children:[
            new Paragraph({children:[r('Americas Head Office',{size:18,bold:true})],spacing:{before:0,after:0}}),
            new Paragraph({children:[r('33 W 60th St. Suite 201',{size:18,color:GREY_MID})],spacing:{before:0,after:0}}),
            new Paragraph({children:[r('New York, New York 10023',{size:18,color:GREY_MID})],spacing:{before:0,after:0}}),
          ],
        }),
        new TableCell({
          width:{size:CONT_W/2,type:WidthType.DXA},
          borders:{top:NO_BORDER,bottom:NO_BORDER,left:NO_BORDER,right:NO_BORDER},
          children:[
            new Paragraph({children:[r('EMEA Head Office',{size:18,bold:true})],alignment:AlignmentType.RIGHT,spacing:{before:0,after:0}}),
            new Paragraph({children:[r('3rd floor, Orion House',{size:18,color:GREY_MID})],alignment:AlignmentType.RIGHT,spacing:{before:0,after:0}}),
            new Paragraph({children:[r('5 Upper St Martin\u2019s Lane',{size:18,color:GREY_MID})],alignment:AlignmentType.RIGHT,spacing:{before:0,after:0}}),
            new Paragraph({children:[r('London, WC2H 9EA',{size:18,color:GREY_MID})],alignment:AlignmentType.RIGHT,spacing:{before:0,after:0}}),
          ],
        }),
      ]})]
    });
    // Remove the separate paragraphs we added above - just use table
    children.length=0;
    children.push(addrTable);
    children.push(emptyP(60,0));
  }

  children.push(new Paragraph({
    children:[r('Private & Confidential',{size:18,color:GREY_MID})],
    alignment:AlignmentType.CENTER,
    border:{top:{style:BorderStyle.SINGLE,size:12,color:BLUE_LIGHT,space:6}},
    spacing:{before:0,after:0},
  }));
  return new Footer({children});
}

// ── Build document ───────────────────────────────────────────────────
const name=cv_data.candidate_name||'Unknown Candidate';
const miss=new Set(cv_data.missing_sections||[]);

const coverChildren=buildCoverChildren(name,prepared_by,date);

const cvChildren=[
  new Paragraph({
    children:[r('CV: '+name,{size:36,color:NAVY,bold:true})],
    border:{bottom:{style:BorderStyle.SINGLE,size:12,color:BLUE_LIGHT,space:6}},
    spacing:{before:0,after:240},
  }),
  sectionH('Professional Experience'),
];

if(miss.has('professional_experience')||!cv_data.professional_experience?.length){
  cvChildren.push(flagP('[PROFESSIONAL EXPERIENCE \u2014 none provided]'));
} else {
  cv_data.professional_experience.forEach((emp,i)=>{
    buildExpTable(emp).forEach(el=>cvChildren.push(el));
    if(i<cv_data.professional_experience.length-1) cvChildren.push(emptyP(160,0));
  });
}
cvChildren.push(sectionH('Education'));
buildEduItems(cv_data.education,miss.has('education')).forEach(el=>cvChildren.push(el));
cvChildren.push(sectionH('Awards & Certifications'));
buildAwardsItems(cv_data.awards_and_certifications,miss.has('awards_and_certifications')).forEach(el=>cvChildren.push(el));
cvChildren.push(sectionH('Additional Valuable Information'));
buildAddlItems(cv_data.additional_information).forEach(el=>cvChildren.push(el));

const doc=new Document({
  numbering:{config:[{
    reference:'gbBullets',
    levels:[{
      level:0, format:LevelFormat.BULLET, text:'\u2022', alignment:AlignmentType.LEFT,
      style:{
        run:{ color:BLUE_LIGHT, font:LATO, size:22 },
        paragraph:{ indent:{left:480,hanging:300}, spacing:{before:40,after:40} },
      },
    }],
  }]},
  styles:{default:{document:{run:{font:LATO,size:22}}}},
  sections:[
    {
      properties:{
        type:SectionType.NEXT_PAGE, titlePage:true,
        page:{size:{width:PAGE_W,height:PAGE_H},margin:{top:MAR_T,bottom:MAR_B,left:MAR_L,right:MAR_R,header:1134,footer:567}},
      },
      headers:{default:buildHeader(),first:buildHeader()},
      footers:{default:buildFooter(true),first:buildFooter(true)},
      children:coverChildren,
    },
    {
      properties:{
        type:SectionType.NEXT_PAGE,
        page:{size:{width:PAGE_W,height:PAGE_H},margin:{top:MAR_T,bottom:MAR_B,left:MAR_L,right:MAR_R,header:1134,footer:567}},
      },
      headers:{default:buildHeader()},
      footers:{default:buildFooter(false)},
      children:cvChildren,
    },
  ],
});

Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync(output_path,buf);
  console.log('Written:',output_path);
}).catch(err=>{ console.error('Error:',err); process.exit(1); });
