const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.ts')) {
      fixFile(full);
    }
  }
}

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (_, a, b, c) => {
      if (b.endsWith('.js') || b.endsWith('.json') || b.endsWith('.prisma')) {
        return a + b + c;
      }

      return a + b + '.js' + c;
    }
  );

  fs.writeFileSync(file, content);
  console.log('✔', file);
}

walk(SRC);

console.log('\nFinished.');
