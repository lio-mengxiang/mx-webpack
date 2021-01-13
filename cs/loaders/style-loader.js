module.exports = function(source){
  console.log('source: ', source);
  let style = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `
  console.log('style: ', style);
  return style;
}
