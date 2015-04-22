var xpath = require('xpath');

function Meta(value, id, refinements) {
  this.value = value;
  this.id = id;
  this.refinements = refinements;
}

Meta.prototype.toString = function() {
  return this.value;
};

function OPF(doc) {
  this.doc = doc;
  var _select = xpath.useNamespaces({
    'dc': 'http://purl.org/dc/elements/1.1/',
    '_': 'http://www.idpf.org/2007/opf'
  });

  this.select = function(query, single) {
    return _select(query, this.doc, single || false);
  };
};

var refinements = function(obj, id) {
  var nodes = obj.select('//_:meta[@refines="#' + id  +  '"]');
  var refs = [];

  nodes.forEach(function(node) {
    var prop = node.getAttribute('property');
    var scheme = node.getAttribute('scheme');
    refs[prop] = {
      value: node.textContent
    };

    if (scheme) {
      refs[prop].scheme = scheme;
    }
  });

  return refs;
};

var buildMetaElement = function(selector, single) {
  var self = this;

  var elements = this.select(selector).map(function(node) {
    var el = {value: node.textContent};
    var id = node.getAttribute('id');
    id = id.length ? id : null;
    return new Meta(node.textContent, id, id ? refinements(self, id) : {});
  });

  if (single) {
    return elements[0];
  }

  return elements;
};

var buildTextElement = function(selector) {
  var node = this.select(selector, true);
  return node ? node.textContent : null;
};

OPF.prototype.version = function() {
  return this.select('/_:package/@version', true).value;
};

OPF.prototype.uniqueIdentifier = function() {
  var uniqueId = this.select('/_:package/@unique-identifier', true).value;
  return buildMetaElement.call(this, '//*[@id="' + uniqueId + '"]', true);
};

OPF.prototype.identifiers = function() {
  return buildMetaElement.call(this, '//dc:identifier');
};

OPF.prototype.creators = function() {
  return buildMetaElement.call(this, '//dc:creator');
};

OPF.prototype.contributors = function() {
  return buildMetaElement.call(this, '//dc:contributor');
};

OPF.prototype.date = function() {
  return buildMetaElement.call(this, '//dc:date');
};

OPF.prototype.modified = function() {
  return buildTextElement.call(this, '//_:meta[@property="dcterms:modified"]');
};

OPF.prototype.language = function() {
  return buildTextElement.call(this, '//dc:language');
};

OPF.prototype.publisher = function() {
  return buildTextElement.call(this, '//dc:publisher');
};

OPF.prototype.titles = function() {
  return buildMetaElement.call(this, '//dc:title');
};

var titleFilter = function(type) {
  return function(t) {
    return t.refinements && t.refinements['title-type'] && t.refinements['title-type'].value === type;
  }
};

OPF.prototype.title = function() {
  var titles = this.titles();

  if (titles.length === 0) {
    return null;
  } else if (titles.length === 1) {
    return titles[0];
  } else {
    var filtered = titles.filter(titleFilter('main'));
    return filtered[0] ? filtered[0] : null;
  }
};

OPF.prototype.rights = function() {
  return buildTextElement.call(this, '//dc:rights');
};

/*
MANIFEST
*/
function Manifest(opf) {
  this.opf = opf;
}

Manifest.prototype.get = function(id) {

};

function ManifestItem(id, href, mediaType, properties, fallback, mediaOverlay) {

}

function createManifestItem() {
  var item = new ManifestItem();
}

OPF.prototype.manifest = function() {

};

module.exports = OPF;
