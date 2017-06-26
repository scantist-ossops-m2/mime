var mime = require('..');
var mimeTypes = require('../node_modules/mime-types');
var assert = require('assert');
var path = require('path');

describe('class Mime', function () {
  it('new constructor()', function () {
    const Mime = require('../Mime');

    const mime = new Mime(
      {'text/a': ['a', 'a1']},
      {'text/b': ['b', 'b1']}
    );

    assert.deepEqual(mime.types, {
      a: 'text/a',
      a1: 'text/a',
      b: 'text/b',
      b1: 'text/b',
    });

    assert.deepEqual(mime.extensions, {
      'text/a': 'a',
      'text/b': 'b',
    });
  });

  it('define()', function () {
    const Mime = require('../Mime');

    const mime = new Mime({'text/a': ['a']}, {'text/b': ['b']});

    assert.throws(function() {
      mime.define({'text/c': ['b']});
    });

    assert.doesNotThrow(function() {
      mime.define({'text/c': ['b']}, true);
    });

    assert.deepEqual(mime.types, {
      a: 'text/a',
      b: 'text/c',
    });

    assert.deepEqual(mime.extensions, {
      'text/a': 'a',
      'text/b': 'b',
      'text/c': 'b',
    });
  });

  it('getType()', function () {
    // Upper/lower case
    assert.equal(mime.getType('text.txt'), 'text/plain');
    assert.equal(mime.getType('TEXT.TXT'), 'text/plain');

    // Bare extension
    assert.equal(mime.getType('txt'), 'text/plain');
    assert.equal(mime.getType('.txt'), 'text/plain');
    assert.strictEqual(mime.getType('.bogus'), null);
    assert.strictEqual(mime.getType('bogus'), null);

    // Non-sensical
    assert.strictEqual(mime.getType(null), null);
    assert.strictEqual(mime.getType(undefined), null);
    assert.strictEqual(mime.getType(42), null);
    assert.strictEqual(mime.getType({}), null);

    // File paths
    assert.equal(mime.getType('dir/text.txt'), 'text/plain');
    assert.equal(mime.getType('dir\\text.txt'), 'text/plain');
    assert.equal(mime.getType('.text.txt'), 'text/plain');
    assert.equal(mime.getType('.txt'), 'text/plain');
    assert.equal(mime.getType('txt'), 'text/plain');
    assert.equal(mime.getType('/path/to/page.html'), 'text/html');
    assert.equal(mime.getType('c:\\path\\to\\page.html'), 'text/html');
    assert.equal(mime.getType('page.html'), 'text/html');
    assert.equal(mime.getType('path/to/page.html'), 'text/html');
    assert.equal(mime.getType('path\\to\\page.html'), 'text/html');
    assert.strictEqual(mime.getType('/txt'),  null);
    assert.strictEqual(mime.getType('\\txt'),  null);
    assert.strictEqual(mime.getType('text.nope'),  null);
    assert.strictEqual(mime.getType('/path/to/file.bogus'), null);
    assert.strictEqual(mime.getType('/path/to/json'), null);
    assert.strictEqual(mime.getType('/path/to/.json'), null);
    assert.strictEqual(mime.getType('/path/to/.config.json'), 'application/json');
    assert.strictEqual(mime.getType('.config.json'), 'application/json');
  });

  it('getExtension()', function() {
    assert.equal(mime.getExtension('text/html'), 'html');
    assert.equal(mime.getExtension(' text/html'), 'html');
    assert.equal(mime.getExtension('text/html '), 'html');
    assert.strictEqual(mime.getExtension('application/x-bogus'), null);
    assert.strictEqual(mime.getExtension('bogus'), null);
    assert.strictEqual(mime.getExtension(null), null);
    assert.strictEqual(mime.getExtension(undefined), null);
    assert.strictEqual(mime.getExtension(42), null);
    assert.strictEqual(mime.getExtension({}), null);
  })
});

describe('DB', function() {
  it('Consistency', function() {
    for (var ext in this.types) {
      const ext2 = this.extensions[this.types[ext]];
      assert.equal(ext, this.extensions[this.types[ext]], '${ext} does not have consistent ext->type->ext mapping');
    }
  });

  it('MDN types', function () {
    // MDN types listed at https://goo.gl/lHrFU6
    const MDN = {
      'aac': 'audio/aac',
      'abw': 'application/x-abiword',
      'arc': 'application/octet-stream',
      'avi': 'video/x-msvideo',
      'azw': 'application/vnd.amazon.ebook',
      'bin': 'application/octet-stream',
      'bz': 'application/x-bzip',
      'bz2': 'application/x-bzip2',
      'csh': 'application/x-csh',
      'css': 'text/css',
      'csv': 'text/csv',
      'doc': 'application/msword',
      'epub': 'application/epub+zip',
      'gif': 'image/gif',
      'html': 'text/html',
      'ico': 'image/x-icon',
      'ics': 'text/calendar',
      'jar': 'application/java-archive',
      'jpg': 'image/jpeg',
      'js': 'application/javascript',
      'json': 'application/json',
      'midi': 'audio/midi',
      'mpeg': 'video/mpeg',
      'mpkg': 'application/vnd.apple.installer+xml',
      'odp': 'application/vnd.oasis.opendocument.presentation',
      'ods': 'application/vnd.oasis.opendocument.spreadsheet',
      'odt': 'application/vnd.oasis.opendocument.text',
      'oga': 'audio/ogg',
      'ogv': 'video/ogg',
      'ogx': 'application/ogg',
      'png': 'image/png',
      'pdf': 'application/pdf',
      'ppt': 'application/vnd.ms-powerpoint',
      'rar': 'application/x-rar-compressed',
      'rtf': 'application/rtf',
      'sh': 'application/x-sh',
      'svg': 'image/svg+xml',
      'swf': 'application/x-shockwave-flash',
      'tar': 'application/x-tar',
      'tiff': 'image/tiff',
      'ttf': 'font/ttf',
      'vsd': 'application/vnd.visio',
      'wav': 'audio/x-wav',
      'weba': 'audio/webm',
      'webm': 'video/webm',
      'webp': 'image/webp',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'xhtml': 'application/xhtml+xml',
      'xls': 'application/vnd.ms-excel',
      'xml': 'application/xml',
      'xul': 'application/vnd.mozilla.xul+xml',
      'zip': 'application/zip',
      '3gp': 'video/3gpp',
      '3g2': 'video/3gpp2',
      '7z': 'application/x-7z-compressed',
    };

    const diffs = [];
    for (let ext in MDN) {
      const expected = MDN[ext];
      const actual = mime.getType(ext);
      if (actual != expected) diffs.push(`MDN[${ext}] = ${expected}, node-uuid[${ext}] = ${actual}`);
    }
    assert(diffs.length <= 0, `Type inconsistencies: ${JSON.stringify(diffs, null, 2)}`);
  });

  it('mime-types types', function () {
    const mimeTypes = require('../node_modules/mime-types');
    const diffs = [];

    for (let ext in mimeTypes.types) {
      const expected = mimeTypes.types[ext];
      const actual = mime.getType(ext);
      if (actual != expected) diffs.push(`mime-types[${ext}] = ${expected}, node-uuid[${ext}] = ${actual}`);
    }
    assert(diffs.length <= 0, `Type inconsistencies: ${JSON.stringify(diffs, null, 2)}`);
  });

  it('types', function () {
    // Assortment of common types
    assert.equal(mime.getType('html'), 'text/html');
    assert.equal(mime.getType('js'), 'application/javascript');
    assert.equal(mime.getType('json'), 'application/json');
    assert.equal(mime.getType('rtf'), 'application/rtf');
    assert.equal(mime.getType('txt'), 'text/plain');
    assert.equal(mime.getType('xml'), 'application/xml');
  });

  it('extensions', function () {
    assert.equal(mime.getExtension('text/html;charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/HTML; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/html; charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('text/html; charset=UTF-8 '), 'html');
    assert.equal(mime.getExtension('text/html ; charset=UTF-8'), 'html');
    assert.equal( mime.getExtension(mime.types.text), 'txt');
    assert.equal( mime.getExtension(mime.types.htm), 'html');
    assert.equal( mime.getExtension('application/octet-stream'), 'bin');
    assert.equal( mime.getExtension('application/octet-stream '), 'bin');
    assert.equal( mime.getExtension(' text/html; charset=UTF-8'), 'html');
    assert.equal( mime.getExtension('text/html; charset=UTF-8 '), 'html');
    assert.equal( mime.getExtension('text/html; charset=UTF-8'), 'html');
    assert.equal( mime.getExtension('text/html ; charset=UTF-8'), 'html');
    assert.equal( mime.getExtension('text/html;charset=UTF-8'), 'html');
    assert.equal( mime.getExtension('text/Html;charset=UTF-8'), 'html');
    assert.equal(mime.getExtension('unrecognized'), null);
  });
});