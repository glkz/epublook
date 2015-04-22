var should = require('should');

var DOMParser = require('xmldom').DOMParser;
var OPF = require('../lib/opf');
var doc = new DOMParser().parseFromString(require('fs').readFileSync(__dirname + '/fixtures/package.opf', 'utf-8'));
var pack = new OPF(doc);


describe('#version', function() {
  it('should return 3.0', function() {
    pack.version().should.be.equal('3.0');
  });
})

describe('#uniqueIdentifier', function() {
  it('should return uniqueIdentifier\'s text value', function() {
    pack.uniqueIdentifier().value.should.be.equal('code.google.com.epub-samples.moby-dick-basic');
  });

  it('should return uniqueIdentifier\'s id', function() {
    pack.uniqueIdentifier().id.should.be.equal('pub-id');
  });
});

describe('#identifiers', function() {
  it('should return identifiers', function() {
    var identifiers = pack.identifiers()
    identifiers.should.be.instanceOf(Array);
    identifiers[0].value.should.be.equal('code.google.com.epub-samples.moby-dick-basic');
  });
});

describe('#creators', function() {
  it('should return creators', function() {
    var identifiers = pack.identifiers()
    identifiers.should.be.instanceOf(Array);
    identifiers[0].value.should.be.equal('code.google.com.epub-samples.moby-dick-basic');
  });
});
