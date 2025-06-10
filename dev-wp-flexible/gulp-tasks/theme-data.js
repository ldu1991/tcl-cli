import fs from 'fs';

const themeData          = JSON.parse(fs.readFileSync('./src/theme.json').toString());
let style_editor_default = `body .is-layout-flow {
    > * + * {
        margin-block-start: 0;
        margin-block-end: 0;
    }
    
    > p {
        margin-block-start: ${themeData['styles']['blocks']['core/paragraph']['spacing']['margin']['top']};
        margin-block-end: ${themeData['styles']['blocks']['core/paragraph']['spacing']['margin']['bottom']};
        
        &:last-child {
            margin-block-end: 0;
        }
    }
    
    > p + p {
        margin-block-start: ${themeData['styles']['blocks']['core/paragraph']['spacing']['margin']['top']};
        margin-block-end: ${themeData['styles']['blocks']['core/paragraph']['spacing']['margin']['bottom']};
    }
    
    > h1, > h1 + h1,
    > h2, > h2 + h2,
    > h3, > h3 + h3,
    > h4, > h4 + h4,
    > h5, > h5 + h5,
    > h6, > h6 + h6 {
        margin-block-start: ${themeData['styles']['elements']['heading']['spacing']['margin']['top']};
        margin-block-end: ${themeData['styles']['elements']['heading']['spacing']['margin']['bottom']};
    }
}`;

// Generate Heading
let elements = {
  'heading': '.h1, .h2, .h3, .h4, .h5, .h6',
  'h1':      '.h1',
  'h2':      '.h2',
  'h3':      '.h3',
  'h4':      '.h4',
  'h5':      '.h5',
  'h6':      '.h6',
};

function generateSpacing(json, prefix = '') {
  let css = '';

  for (const key in json) {
    const value = json[key];
    if (value !== '') {
      if (typeof value === 'object') {
        css += generateSpacing(value, `${prefix}${key}-`);
      } else {
        const kebabCaseKey = `${prefix}${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        css += `${kebabCaseKey}: ${value}; `;
      }
    }
  }

  return css;
}

function generateTypography(json) {
  let css = '';

  for (const key in json) {
    const value = json[key];
    if (value) {
      if (key === 'textColumns') {
        css += `column-count: ${value};`;
      } else {
        css += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
      }
    }
  }

  return css;
}

function generateColor(json) {
  let css = '';

  for (const key in json) {
    const value = json[key];
    if (value !== '') {
      if (key === 'gradient') {
        css += 'background:' + value + ';';
      } else if (key === 'background') {
        css += 'background-color:' + value + ';';
      } else if (key === 'text') {
        css += 'color:' + value + ';';
      }
    }
  }

  return css;
}

function generateBorder(json, prefix = '') {
  let css = '';

  for (const key in json) {
    const value = json[key];

    if (typeof value === 'object') {
      css += generateBorder(value, `${prefix}${key}-`);
    } else if (value) {
      const cssProperty  = `${prefix}${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      const propertyName = `border-${cssProperty}`;
      css += `${propertyName}: ${value};\n`;
    }
  }

  return css;
}

function generateOutline(json) {
  let css = '';

  for (const key in json) {
    const value = json[key];
    if (value !== '') {
      css += `outline-${key}: ${value};`;
    }
  }

  return css;
}

function generateDimensions(json) {
  let css = '';

  for (const key in json) {
    const value = json[key];
    if (value !== '') {
      css += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
    }
  }

  return css;
}

let additional_header_classes = '';
for (let elementsKey in elements) {
  let elementValue = themeData.styles.elements[elementsKey];

  if (elementValue !== undefined) {
    additional_header_classes += elements[elementsKey] + '{';
    for (let elementKey in elementValue) {

      if (elementKey === 'spacing') {
        additional_header_classes += generateSpacing(elementValue[elementKey]);
      } else if (elementKey === 'typography') {
        additional_header_classes += generateTypography(elementValue[elementKey]);
      } else if (elementKey === 'color') {
        additional_header_classes += generateColor(elementValue[elementKey]);
      } else if (elementKey === 'border') {
        additional_header_classes += generateBorder(elementValue[elementKey]);
      } else if (elementKey === 'outline') {
        additional_header_classes += generateOutline(elementValue[elementKey]);
      } else if (elementKey === 'dimensions') {
        additional_header_classes += generateDimensions(elementValue[elementKey]);
      } else if (elementKey === 'shadow') {
        additional_header_classes += `box-shadow: ${elementValue[elementKey]};`;
      }
    }

    additional_header_classes += '}';
  }
}


export {style_editor_default, additional_header_classes};
