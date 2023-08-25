const test = require("node:test");
const { equal } = require("node:assert");

const { parseHTTPStatus, parseYariDynamicContent, parseMDNLinks, parseImages, parseElementTerm, parseCSSTerm, replaceHTMLGlossaryLinks, replaceDOMXrefLinks } = require("./yari.parser");

test('Parsing {{glossary("XML")}}', () => {
  const input = `{{glossary("XML")}}`;
  const output = parseYariDynamicContent(input);
  equal(output, "[XML](https://developer.mozilla.org/en-US/docs/Glossary/XML)");
});

test('Parsing {{glossary("term")}}', () => {
  
  const input = `{{glossary("HTML")}}`;
  const output = parseYariDynamicContent(input);
  equal(output, "[HTML](https://developer.mozilla.org/en-US/docs/Glossary/HTML)");

  const input2 = `{{Glossary("browser")}}`;
  const output2 = parseYariDynamicContent(input2);
  equal(output2, "[browser](https://developer.mozilla.org/en-US/docs/Glossary/Browser)");

});

test('Parsing {{glossary("1", "2")}}', () => {
  const input = `{{glossary("attribute", "attributes")}}`;
  const output = parseYariDynamicContent(input);
  equal(output, "[attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute)");

  const input2 = `{{glossary("void element", "void elements")}}`;
  const output2 = parseYariDynamicContent(input2);
  equal(output2, "[void elements](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)");

  const input3 = `{{Glossary("tag", "tags")}}`;
  const output3 = parseYariDynamicContent(input3);
  equal(output3, "[tags](https://developer.mozilla.org/en-US/docs/Glossary/Tag)");

});

test("Parsing <tag>{{Glossary()}}</tag>", ()=>{

  const input = `<tr><th scope="row">{{Glossary("String")}}</th></tr>`;
  const output = `<tr><th scope="row"><a href="https://developer.mozilla.org/en-US/docs/Glossary/String">String</a></th></tr>`;
  equal( output, replaceHTMLGlossaryLinks(input) );

});

test("Replacing MDN relative links with absolute URLs", () => {

  const input = `lorem ipsum [What will your website look like?](/en-US/docs/Learn/Getting_started_with_the_web/What_will_your_website_look_like#font) lorem ipsum`;
  const output = parseMDNLinks(input);
  equal(output, "lorem ipsum [What will your website look like?](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/What_will_your_website_look_like#font) lorem ipsum");
  
});

test("Replacing MDN image links with local assets/ folder", ()=>{
  // parseImages()
  const input = `lorem ipsum ![Three boxes sat inside one another. From outside to in they are labelled margin, border and padding](box-model.png) lorem ipsum`;
  const output = parseImages(input);
  equal(output, "lorem ipsum ![Three boxes sat inside one another. From outside to in they are labelled margin, border and padding](assets/box-model.png) lorem ipsum");
})

test("Replacing {{htmlelement}} with links", ()=>{

  // INPUT
  const input1 = `{{htmlelement("Heading_Elements", "h1")}}`
  const input2 = `{{htmlelement("body")}}`
  const input3 = `{{HTMLElement("head")}}`
  const input4 = `{{HTMLElement("p")}}`
  const input5 = `{{htmlelement("p")}}`

  const output1 = "[`<h1>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)"
  const output2 = "[`<body>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body)"
  const output3 = "[`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)"
  const output4 = "[`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p)"
  const output5 = "[`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p)"

  equal(parseElementTerm(input1), output1);
  equal(parseElementTerm(input2), output2);
  equal(parseElementTerm(input3), output3);
  equal(parseElementTerm(input4), output4);
  equal(parseElementTerm(input5), output5);

})

test("Replacing {{cssxref}} with links", ()=>{

  const input = `lorem ipsum {{cssxref("width")}} lorem ipsum`;
  const output = "lorem ipsum [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) lorem ipsum";
  equal(parseCSSTerm(input), output);

})

test("Replacing {{HTTPStatus}} with links", ()=>{

  const input = `lorem ipsum {{HTTPStatus("404", "404 Not Found")}} lorem ipsum`;
  const output = "lorem ipsum [404 Not Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) lorem ipsum";
  equal(parseHTTPStatus(input), output);

})

test("Replacing {{domxref}}", ()=>{

  const input1 = `lorem ipsum {{domxref("Document.querySelector", "querySelector()")}} lorem ipsum`;
  const output1 = `lorem ipsum [querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) lorem ipsum`;
  equal( output1, replaceDOMXrefLinks(input1) );
  
  const input2 = `lorem ipsum {{domxref("Node.textContent", "textContent")}} lorem ipsum`; 
  const output2 = `lorem ipsum [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) lorem ipsum`; 

  equal( output2, replaceDOMXrefLinks(input2) );

  const input3 = `lorem ipsum {{domxref("Element/click_event", "click")}} lorem ipsum`;
  const output3 = `lorem ipsum [click](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) lorem ipsum`; 

  equal( output3, replaceDOMXrefLinks(input3) );

  const input4 = `lorem ipsum {{domxref("WebRTC API", "WebRTC")}} lorem ipsum`
  const output4 = `lorem ipsum [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) lorem ipsum`

  equal( output4, replaceDOMXrefLinks(input4) );

})