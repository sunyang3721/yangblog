/**
 * this framework base on jq 1.6.2
 **/
var gb = gb = gb || {};
(function () {
    function initInput($input_, parms_, callBackFn_) {
        var thumbW = parms_.width;

        var imgW, imgH;

        $input_.unbind().bind('change', function (e) {
            var self = this;
            var files = self.files;
            var file = files[0];

            var fr = new FileReader();

            var $canvas = $('<canvas></canvas>');
            var canvas = $canvas[0];
            var context = canvas.getContext('2d');

            var callback = function (fEvt) {
                var dataURL = canvas.toDataURL();

                if ($.isFunction(callBackFn_)) {
                    callBackFn_.call(window, dataURL);
                }
                $canvas.remove();
            };
            var mpImg = new MegaPixImage(file);
            var drawImage = function (fEvt, exif) {
                console.log(2);
                var orientation = exif.Orientation;
                canvas.width = thumbW;
                canvas.height = thumbW / (imgW / imgH);
//                if (opts.background) {
//                    context.fillStyle = opts.background
//                    context.fillRect(0, 0, opts.width, opts.height);
//                }
                mpImg.render(canvas, { maxWidth: canvas.width * 1.0, maxHeight: canvas.height * 1.0, orientation: orientation });
                return callback(fEvt);
            };

            fr.onerror = function () {
                alert('read file error!!!');
            };

            fr.onload = function (fEvt) {
                console.log(1);
                var target = fEvt.target;
                var result = target.result;
                var image = new Image();
                var exif;
                image.onload = function () {
                    imgW = image.width;
                    imgH = image.height;
                    drawImage(fEvt, exif);
                };
                var base64 = result.replace(/^.*?,/, '');
                var binary = atob(base64);
                var binaryData = new BinaryFile(binary);
                exif = EXIF.readFromBinaryFile(binaryData);

                image.src = result;
            };

            fr.readAsDataURL(file);
        });


    }

    //
    var obj = {};
    obj.initInput = initInput;
    gb.makeThumb = obj;
})();

var BinaryFile = function (f, c, b) {
    var d = f;
    var a = c || 0;
    var e = 0;
    this.getRawData = function () {
        return d;
    };
    if (typeof f == "string") {
        e = b || d.length;
        this.getByteAt = function (g) {
            return d.charCodeAt(g + a) & 255;
        };
        this.getBytesAt = function (k, j) {
            var g = [];
            for (var h = 0; h < j; h++) {
                g[h] = d.charCodeAt((k + h) + a) & 255;
            }
            return g;
        };
    } else {
        if (typeof f == "unknown") {
            e = b || IEBinary_getLength(d);
            this.getByteAt = function (g) {
                return IEBinary_getByteAt(d, g + a);
            };
            this.getBytesAt = function (h, g) {
                return new VBArray(IEBinary_getBytesAt(d, h + a, g)).toArray();
            };
        }
    }
    this.getLength = function () {
        return e;
    };
    this.getSByteAt = function (h) {
        var g = this.getByteAt(h);
        if (g > 127) {
            return g - 256;
        } else {
            return g;
        }
    };
    this.getShortAt = function (i, g) {
        var h = g ? (this.getByteAt(i) << 8) + this.getByteAt(i + 1) : (this.getByteAt(i + 1) << 8) + this.getByteAt(i);
        if (h < 0) {
            h += 65536;
        }
        return h;
    };
    this.getSShortAt = function (i, h) {
        var g = this.getShortAt(i, h);
        if (g > 32767) {
            return g - 65536;
        } else {
            return g;
        }
    };
    this.getLongAt = function (l, h) {
        var k = this.getByteAt(l), j = this.getByteAt(l + 1), i = this.getByteAt(l + 2), g = this.getByteAt(l + 3);
        var m = h ? (((((k << 8) + j) << 8) + i) << 8) + g : (((((g << 8) + i) << 8) + j) << 8) + k;
        if (m < 0) {
            m += 4294967296;
        }
        return m;
    };
    this.getSLongAt = function (i, g) {
        var h = this.getLongAt(i, g);
        if (h > 2147483647) {
            return h - 4294967296;
        } else {
            return h;
        }
    };
    this.getStringAt = function (l, k) {
        var h = [];
        var g = this.getBytesAt(l, k);
        for (var i = 0; i < k; i++) {
            h[i] = String.fromCharCode(g[i]);
        }
        return h.join("");
    };
    this.getCharAt = function (g) {
        return String.fromCharCode(this.getByteAt(g));
    };
    this.toBase64 = function () {
        return window.btoa(d);
    };
    this.fromBase64 = function (g) {
        d = window.atob(g);
    };
};
var BinaryAjax = (function () {
    function b() {
        var d = null;
        if (window.ActiveXObject) {
            d = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            if (window.XMLHttpRequest) {
                d = new XMLHttpRequest();
            }
        }
        return d;
    }

    function c(g, d, f) {
        var e = b();
        if (e) {
            if (d) {
                if (typeof(e.onload) != "undefined") {
                    e.onload = function () {
                        if (e.status == "200") {
                            d(this);
                        } else {
                            if (f) {
                                f();
                            }
                        }
                        e = null;
                    };
                } else {
                    e.onreadystatechange = function () {
                        if (e.readyState == 4) {
                            if (e.status == "200") {
                                d(this);
                            } else {
                                if (f) {
                                    f();
                                }
                            }
                            e = null;
                        }
                    };
                }
            }
            e.open("HEAD", g, true);
            e.send(null);
        } else {
            if (f) {
                f();
            }
        }
    }

    function a(e, h, g, d, i, j) {
        var f = b();
        if (f) {
            var k = 0;
            if (d && !i) {
                k = d[0];
            }
            var l = 0;
            if (d) {
                l = d[1] - d[0] + 1;
            }
            if (h) {
                if (typeof(f.onload) != "undefined") {
                    f.onload = function () {
                        if (f.status == "200" || f.status == "206" || f.status == "0") {
                            f.binaryResponse = new BinaryFile(f.responseText, k, l);
                            f.fileSize = j || f.getResponseHeader("Content-Length");
                            h(f);
                        } else {
                            if (g) {
                                g();
                            }
                        }
                        f = null;
                    };
                } else {
                    f.onreadystatechange = function () {
                        if (f.readyState == 4) {
                            if (f.status == "200" || f.status == "206" || f.status == "0") {
                                var m = {status: f.status, binaryResponse: new BinaryFile(typeof f.responseBody == "unknown" ? f.responseBody : f.responseText, k, l), fileSize: j || f.getResponseHeader("Content-Length")};
                                h(m);
                            } else {
                                if (g) {
                                    g();
                                }
                            }
                            f = null;
                        }
                    };
                }
            }
            f.open("GET", e, true);
            if (f.overrideMimeType) {
                f.overrideMimeType("text/plain; charset=x-user-defined");
            }
            if (d && i) {
                f.setRequestHeader("Range", "bytes=" + d[0] + "-" + d[1]);
            }
            f.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");
            f.send(null);
        } else {
            if (g) {
                g();
            }
        }
    }

    return function (g, d, f, e) {
        if (e) {
            c(g, function (j) {
                var l = parseInt(j.getResponseHeader("Content-Length"), 10);
                var k = j.getResponseHeader("Accept-Ranges");
                var i, h;
                i = e[0];
                if (e[0] < 0) {
                    i += l;
                }
                h = i + e[1] - 1;
                a(g, d, f, [i, h], (k == "bytes"), l);
            });
        } else {
            a(g, d, f);
        }
    };
}());
var EXIF = {};
(function () {
    var h = false;
    EXIF.Tags = {36864: "ExifVersion", 40960: "FlashpixVersion", 40961: "ColorSpace", 40962: "PixelXDimension", 40963: "PixelYDimension", 37121: "ComponentsConfiguration", 37122: "CompressedBitsPerPixel", 37500: "MakerNote", 37510: "UserComment", 40964: "RelatedSoundFile", 36867: "DateTimeOriginal", 36868: "DateTimeDigitized", 37520: "SubsecTime", 37521: "SubsecTimeOriginal", 37522: "SubsecTimeDigitized", 33434: "ExposureTime", 33437: "FNumber", 34850: "ExposureProgram", 34852: "SpectralSensitivity", 34855: "ISOSpeedRatings", 34856: "OECF", 37377: "ShutterSpeedValue", 37378: "ApertureValue", 37379: "BrightnessValue", 37380: "ExposureBias", 37381: "MaxApertureValue", 37382: "SubjectDistance", 37383: "MeteringMode", 37384: "LightSource", 37385: "Flash", 37396: "SubjectArea", 37386: "FocalLength", 41483: "FlashEnergy", 41484: "SpatialFrequencyResponse", 41486: "FocalPlaneXResolution", 41487: "FocalPlaneYResolution", 41488: "FocalPlaneResolutionUnit", 41492: "SubjectLocation", 41493: "ExposureIndex", 41495: "SensingMethod", 41728: "FileSource", 41729: "SceneType", 41730: "CFAPattern", 41985: "CustomRendered", 41986: "ExposureMode", 41987: "WhiteBalance", 41988: "DigitalZoomRation", 41989: "FocalLengthIn35mmFilm", 41990: "SceneCaptureType", 41991: "GainControl", 41992: "Contrast", 41993: "Saturation", 41994: "Sharpness", 41995: "DeviceSettingDescription", 41996: "SubjectDistanceRange", 40965: "InteroperabilityIFDPointer", 42016: "ImageUniqueID"};
    EXIF.TiffTags = {256: "ImageWidth", 257: "ImageHeight", 34665: "ExifIFDPointer", 34853: "GPSInfoIFDPointer", 40965: "InteroperabilityIFDPointer", 258: "BitsPerSample", 259: "Compression", 262: "PhotometricInterpretation", 274: "Orientation", 277: "SamplesPerPixel", 284: "PlanarConfiguration", 530: "YCbCrSubSampling", 531: "YCbCrPositioning", 282: "XResolution", 283: "YResolution", 296: "ResolutionUnit", 273: "StripOffsets", 278: "RowsPerStrip", 279: "StripByteCounts", 513: "JPEGInterchangeFormat", 514: "JPEGInterchangeFormatLength", 301: "TransferFunction", 318: "WhitePoint", 319: "PrimaryChromaticities", 529: "YCbCrCoefficients", 532: "ReferenceBlackWhite", 306: "DateTime", 270: "ImageDescription", 271: "Make", 272: "Model", 305: "Software", 315: "Artist", 33432: "Copyright"};
    EXIF.GPSTags = {0: "GPSVersionID", 1: "GPSLatitudeRef", 2: "GPSLatitude", 3: "GPSLongitudeRef", 4: "GPSLongitude", 5: "GPSAltitudeRef", 6: "GPSAltitude", 7: "GPSTimeStamp", 8: "GPSSatellites", 9: "GPSStatus", 10: "GPSMeasureMode", 11: "GPSDOP", 12: "GPSSpeedRef", 13: "GPSSpeed", 14: "GPSTrackRef", 15: "GPSTrack", 16: "GPSImgDirectionRef", 17: "GPSImgDirection", 18: "GPSMapDatum", 19: "GPSDestLatitudeRef", 20: "GPSDestLatitude", 21: "GPSDestLongitudeRef", 22: "GPSDestLongitude", 23: "GPSDestBearingRef", 24: "GPSDestBearing", 25: "GPSDestDistanceRef", 26: "GPSDestDistance", 27: "GPSProcessingMethod", 28: "GPSAreaInformation", 29: "GPSDateStamp", 30: "GPSDifferential"};
    EXIF.StringValues = {ExposureProgram: {0: "Not defined", 1: "Manual", 2: "Normal program", 3: "Aperture priority", 4: "Shutter priority", 5: "Creative program", 6: "Action program", 7: "Portrait mode", 8: "Landscape mode"}, MeteringMode: {0: "Unknown", 1: "Average", 2: "CenterWeightedAverage", 3: "Spot", 4: "MultiSpot", 5: "Pattern", 6: "Partial", 255: "Other"}, LightSource: {0: "Unknown", 1: "Daylight", 2: "Fluorescent", 3: "Tungsten (incandescent light)", 4: "Flash", 9: "Fine weather", 10: "Cloudy weather", 11: "Shade", 12: "Daylight fluorescent (D 5700 - 7100K)", 13: "Day white fluorescent (N 4600 - 5400K)", 14: "Cool white fluorescent (W 3900 - 4500K)", 15: "White fluorescent (WW 3200 - 3700K)", 17: "Standard light A", 18: "Standard light B", 19: "Standard light C", 20: "D55", 21: "D65", 22: "D75", 23: "D50", 24: "ISO studio tungsten", 255: "Other"}, Flash: {0: "Flash did not fire", 1: "Flash fired", 5: "Strobe return light not detected", 7: "Strobe return light detected", 9: "Flash fired, compulsory flash mode", 13: "Flash fired, compulsory flash mode, return light not detected", 15: "Flash fired, compulsory flash mode, return light detected", 16: "Flash did not fire, compulsory flash mode", 24: "Flash did not fire, auto mode", 25: "Flash fired, auto mode", 29: "Flash fired, auto mode, return light not detected", 31: "Flash fired, auto mode, return light detected", 32: "No flash function", 65: "Flash fired, red-eye reduction mode", 69: "Flash fired, red-eye reduction mode, return light not detected", 71: "Flash fired, red-eye reduction mode, return light detected", 73: "Flash fired, compulsory flash mode, red-eye reduction mode", 77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected", 79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected", 89: "Flash fired, auto mode, red-eye reduction mode", 93: "Flash fired, auto mode, return light not detected, red-eye reduction mode", 95: "Flash fired, auto mode, return light detected, red-eye reduction mode"}, SensingMethod: {1: "Not defined", 2: "One-chip color area sensor", 3: "Two-chip color area sensor", 4: "Three-chip color area sensor", 5: "Color sequential area sensor", 7: "Trilinear sensor", 8: "Color sequential linear sensor"}, SceneCaptureType: {0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night scene"}, SceneType: {1: "Directly photographed"}, CustomRendered: {0: "Normal process", 1: "Custom process"}, WhiteBalance: {0: "Auto white balance", 1: "Manual white balance"}, GainControl: {0: "None", 1: "Low gain up", 2: "High gain up", 3: "Low gain down", 4: "High gain down"}, Contrast: {0: "Normal", 1: "Soft", 2: "Hard"}, Saturation: {0: "Normal", 1: "Low saturation", 2: "High saturation"}, Sharpness: {0: "Normal", 1: "Soft", 2: "Hard"}, SubjectDistanceRange: {0: "Unknown", 1: "Macro", 2: "Close view", 3: "Distant view"}, FileSource: {3: "DSC"}, Components: {0: "", 1: "Y", 2: "Cb", 3: "Cr", 4: "R", 5: "G", 6: "B"}};
    function d(j, l, k) {
        if (j.addEventListener) {
            j.addEventListener(l, k, false);
        } else {
            if (j.attachEvent) {
                j.attachEvent("on" + l, k);
            }
        }
    }

    function c(j) {
        return !!(j.exifdata);
    }

    function e(k, j) {
        BinaryAjax(k.src, function (l) {
            var m = a(l.binaryResponse);
            k.exifdata = m || {};
            if (j) {
                j();
            }
        });
    }

    function a(m) {
        var j = [];
        if (m.getByteAt(0) != 255 || m.getByteAt(1) != 216) {
            return false;
        }
        var l = 2;
        var k = m.getLength();
        while (l < k) {
            if (m.getByteAt(l) != 255) {
                if (h) {
                    console.log("Not a valid marker at offset " + l + ", found: " + m.getByteAt(l));
                }
                return false;
            }
            var n = m.getByteAt(l + 1);
            if (n == 22400) {
                if (h) {
                    console.log("Found 0xFFE1 marker");
                }
                return g(m, l + 4, m.getShortAt(l + 2, true) - 2);
                l += 2 + m.getShortAt(l + 2, true);
            } else {
                if (n == 225) {
                    if (h) {
                        console.log("Found 0xFFE1 marker");
                    }
                    return g(m, l + 4, m.getShortAt(l + 2, true) - 2);
                } else {
                    l += 2 + m.getShortAt(l + 2, true);
                }
            }
        }
    }

    function f(q, n, s, k, p) {
        var j = q.getShortAt(s, p);
        var o = {};
        for (var l = 0; l < j;
             l++) {
            var r = s + l * 12 + 2;
            var m = k[q.getShortAt(r, p)];
            if (!m && h) {
                console.log("Unknown tag: " + q.getShortAt(r, p));
            }
            o[m] = b(q, r, n, s, p);
        }
        return o;
    }

    function b(t, v, o, u, q) {
        var r = t.getShortAt(v + 2, q);
        var s = t.getLongAt(v + 4, q);
        var l = t.getLongAt(v + 8, q) + o;
        switch (r) {
            case 1:
            case 7:
                if (s == 1) {
                    return t.getByteAt(v + 8, q);
                } else {
                    var j = s > 4 ? l : (v + 8);
                    var p = [];
                    for (var k = 0;
                         k < s; k++) {
                        p[k] = t.getByteAt(j + k);
                    }
                    return p;
                }
                break;
            case 2:
                var m = s > 4 ? l : (v + 8);
                return t.getStringAt(m, s - 1);
                break;
            case 3:
                if (s == 1) {
                    return t.getShortAt(v + 8, q);
                } else {
                    var j = s > 2 ? l : (v + 8);
                    var p = [];
                    for (var k = 0; k < s; k++) {
                        p[k] = t.getShortAt(j + 2 * k, q);
                    }
                    return p;
                }
                break;
            case 4:
                if (s == 1) {
                    return t.getLongAt(v + 8, q);
                } else {
                    var p = [];
                    for (var k = 0; k < s; k++) {
                        p[k] = t.getLongAt(l + 4 * k, q);
                    }
                    return p;
                }
                break;
            case 5:
                if (s == 1) {
                    return t.getLongAt(l, q) / t.getLongAt(l + 4, q);
                } else {
                    var p = [];
                    for (var k = 0; k < s; k++) {
                        p[k] = t.getLongAt(l + 8 * k, q) / t.getLongAt(l + 4 + 8 * k, q);
                    }
                    return p;
                }
                break;
            case 9:
                if (s == 1) {
                    return t.getSLongAt(v + 8, q);
                } else {
                    var p = [];
                    for (var k = 0; k < s; k++) {
                        p[k] = t.getSLongAt(l + 4 * k, q);
                    }
                    return p;
                }
                break;
            case 10:
                if (s == 1) {
                    return t.getSLongAt(l, q) / t.getSLongAt(l + 4, q);
                } else {
                    var p = [];
                    for (var k = 0; k < s; k++) {
                        p[k] = t.getSLongAt(l + 8 * k, q) / t.getSLongAt(l + 4 + 8 * k, q);
                    }
                    return p;
                }
                break;
        }
    }

    function g(r, j, l) {
        if (r.getStringAt(j, 4) != "Exif") {
            if (h) {
                console.log("Not valid EXIF data! " + r.getStringAt(j, 4));
            }
            return false;
        }
        var p;
        var m = j + 6;
        if (r.getShortAt(m) == 18761) {
            p = false;
        } else {
            if (r.getShortAt(m) == 19789) {
                p = true;
            } else {
                if (h) {
                    console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
                }
                return false;
            }
        }
        if (r.getShortAt(m + 2, p) != 42) {
            if (h) {
                console.log("Not valid TIFF data! (no 0x002A)");
            }
            return false;
        }
        if (r.getLongAt(m + 4, p) != 8) {
            if (h) {
                console.log("Not valid TIFF data! (First offset not 8)", r.getShortAt(m + 4, p));
            }
            return false;
        }
        var o = f(r, m, m + 8, EXIF.TiffTags, p);
        if (o.ExifIFDPointer) {
            var q = f(r, m, m + o.ExifIFDPointer, EXIF.Tags, p);
            for (var n in q) {
                switch (n) {
                    case"LightSource":
                    case"Flash":
                    case"MeteringMode":
                    case"ExposureProgram":
                    case"SensingMethod":
                    case"SceneCaptureType":
                    case"SceneType":
                    case"CustomRendered":
                    case"WhiteBalance":
                    case"GainControl":
                    case"Contrast":
                    case"Saturation":
                    case"Sharpness":
                    case"SubjectDistanceRange":
                    case"FileSource":
                        q[n] = EXIF.StringValues[n][q[n]];
                        break;
                    case"ExifVersion":
                    case"FlashpixVersion":
                        q[n] = String.fromCharCode(q[n][0], q[n][1], q[n][2], q[n][3]);
                        break;
                    case"ComponentsConfiguration":
                        q[n] = EXIF.StringValues.Components[q[n][0]] + EXIF.StringValues.Components[q[n][1]] + EXIF.StringValues.Components[q[n][2]] + EXIF.StringValues.Components[q[n][3]];
                        break;
                }
                o[n] = q[n];
            }
        }
        if (o.GPSInfoIFDPointer) {
            var k = f(r, m, m + o.GPSInfoIFDPointer, EXIF.GPSTags, p);
            for (var n in k) {
                switch (n) {
                    case"GPSVersionID":
                        k[n] = k[n][0] + "." + k[n][1] + "." + k[n][2] + "." + k[n][3];
                        break;
                }
                o[n] = k[n];
            }
        }
        return o;
    }

    EXIF.getData = function (k, j) {
        if (!k.complete) {
            return false;
        }
        if (!c(k)) {
            e(k, j);
        } else {
            if (j) {
                j();
            }
        }
        return true;
    };
    EXIF.getTag = function (k, j) {
        if (!c(k)) {
            return;
        }
        return k.exifdata[j];
    };
    EXIF.getAllTags = function (l) {
        if (!c(l)) {
            return{};
        }
        var m = l.exifdata;
        var k = {};
        for (var j in m) {
            if (m.hasOwnProperty(j)) {
                k[j] = m[j];
            }
        }
        return k;
    };
    EXIF.pretty = function (l) {
        if (!c(l)) {
            return"";
        }
        var m = l.exifdata;
        var k = "";
        for (var j in m) {
            if (m.hasOwnProperty(j)) {
                if (typeof m[j] == "object") {
                    k += j + " : [" + m[j].length + " values]\r\n";
                } else {
                    k += j + " : " + m[j] + "\r\n";
                }
            }
        }
        return k;
    };
    EXIF.readFromBinaryFile = function (j) {
        return a(j);
    };
    function i() {
        var k = document.getElementsByTagName("img");
        for (var j = 0;
             j < k.length; j++) {
            if (k[j].getAttribute("exif") == "true") {
                if (!k[j].complete) {
                    d(k[j], "load", function () {
                        EXIF.getData(this);
                    });
                } else {
                    EXIF.getData(k[j]);
                }
            }
        }
    }

    d(window, "load", i);
})();
(function () {
    function c(i) {
        var h = i.naturalWidth, k = i.naturalHeight;
        if (h * k > 1024 * 1024) {
            var j = document.createElement("canvas");
            j.width = j.height = 1;
            var g = j.getContext("2d");
            g.drawImage(i, -h + 1, 0);
            return g.getImageData(0, 0, 1, 1).data[3] === 0;
        } else {
            return false;
        }
    }

    function d(k, h, p) {
        var g = document.createElement("canvas");
        g.width = 1;
        g.height = p;
        var q = g.getContext("2d");
        q.drawImage(k, 0, 0);
        var j = q.getImageData(0, 0, 1, p).data;
        var n = 0;
        var l = p;
        var o = p;
        while (o > n) {
            var i = j[(o - 1) * 4 + 3];
            if (i === 0) {
                l = o;
            } else {
                n = o;
            }
            o = (l + n) >> 1;
        }
        var m = (o / p);
        return(m === 0) ? 1 : m;
    }

    function f(g, i, j) {
        var h = document.createElement("canvas");
        a(g, h, i, j);
        return h.toDataURL("image/jpeg", i.quality || 0.8);
    }

    function a(z, j, k, g) {
        var m = z.naturalWidth, q = z.naturalHeight;
        var u = k.width, t = k.height;
        var v = j.getContext("2d");
        v.save();
        b(j, u, t, k.orientation);
        var i = c(z);
        if (i) {
            m /= 2;
            q /= 2;
        }
        var y = 1024;
        var h = document.createElement("canvas");
        h.width = h.height = y;
        var l = h.getContext("2d");
        var w = g ? d(z, m, q) : 1;
        var p = Math.ceil(y * u / m);
        var x = Math.ceil(y * t / q / w);
        var r = 0;
        var n = 0;
        while (r < q) {
            var s = 0;
            var o = 0;
            while (s < m) {
                l.clearRect(0, 0, y, y);
                l.drawImage(z, -s, -r);
                v.drawImage(h, 0, 0, y, y, o, n, p, x);
                s += y;
                o += p;
            }
            r += y;
            n += x;
        }
        v.restore();
        h = l = null;
    }

    function b(j, k, g, i) {
        switch (i) {
            case 5:
            case 6:
            case 7:
            case 8:
                j.width = g;
                j.height = k;
                break;
            default:
                j.width = k;
                j.height = g;
        }
        var h = j.getContext("2d");
        switch (i) {
            case 2:
                h.translate(k, 0);
                h.scale(-1, 1);
                break;
            case 3:
                h.translate(k, g);
                h.rotate(Math.PI);
                break;
            case 4:
                h.translate(0, g);
                h.scale(1, -1);
                break;
            case 5:
                h.rotate(0.5 * Math.PI);
                h.scale(1, -1);
                break;
            case 6:
                h.rotate(0.5 * Math.PI);
                h.translate(0, -g);
                break;
            case 7:
                h.rotate(0.5 * Math.PI);
                h.translate(k, -g);
                h.scale(-1, 1);
                break;
            case 8:
                h.rotate(-0.5 * Math.PI);
                h.translate(-k, 0);
                break;
            default:
                break;
        }
    }

    function e(i) {
        if (i instanceof Blob) {
            var h = new Image();
            var g = window.URL && window.URL.createObjectURL ? window.URL : window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL : null;
            if (!g) {
                throw Error("No createObjectURL function found to create blob url");
            }
            h.src = g.createObjectURL(i);
            this.blob = i;
            i = h;
        }
        if (!i.naturalWidth && !i.naturalHeight) {
            var j = this;
            i.onload = function () {
                var m = j.imageLoadListeners;
                if (m) {
                    j.imageLoadListeners = null;
                    for (var l = 0, k = m.length; l < k; l++) {
                        m[l]();
                    }
                }
            };
            this.imageLoadListeners = [];
        }
        this.srcImage = i;
    }

    e.prototype.render = function (m, t) {
        if (this.imageLoadListeners) {
            var l = this;
            this.imageLoadListeners.push(function () {
                l.render(m, t);
            });
            return;
        }
        t = t || {};
        var n = this.srcImage.naturalWidth, o = this.srcImage.naturalHeight, h = t.width, r = t.height, q = t.maxWidth, p = t.maxHeight, s = !this.blob || this.blob.type === "image/jpeg";
        if (h && !r) {
            r = (o * h / n) << 0;
        } else {
            if (r && !h) {
                h = (n * r / o) << 0;
            } else {
                h = n;
                r = o;
            }
        }
        if (q && h > q) {
            h = q;
            r = (o * h / n) << 0;
        }
        if (p && r > p) {
            r = p;
            h = (n * r / o) << 0;
        }
        var g = {width: h, height: r};
        for (var j in t) {
            g[j] = t[j];
        }
        var i = m.tagName.toLowerCase();
        if (i === "img") {
            m.src = f(this.srcImage, g, s);
        } else {
            if (i === "canvas") {
                a(this.srcImage, m, g, s);
            }
        }
        if (typeof this.onrender === "function") {
            this.onrender(m);
        }
    };
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return e;
        });
    } else {
        this.MegaPixImage = e;
    }
})();
document.write("<script type='text/vbscript'>\r\nFunction IEBinary_getByteAt(strBinary, iOffset)\r\n        IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\nEnd Function\r\nFunction IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n  Dim aBytes()\r\n  ReDim aBytes(iLength - 1)\r\n  For i = 0 To iLength - 1\r\n   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n  Next\r\n  IEBinary_getBytesAt = aBytes\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n        IEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n<\/script>\r\n");
/*! Hammer.JS - v1.0.9 - 2014-03-24
 * http://eightmedia.github.io/hammer.js
 *
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */


!function (a, b) {
    "use strict";
    function c() {
        d.READY || (s.determineEventTypes(), o.each(d.gestures, function (a) {
            u.register(a)
        }), s.onTouch(d.DOCUMENT, m, u.detect), s.onTouch(d.DOCUMENT, n, u.detect), d.READY = !0)
    }

    var d = function (a, b) {
        return new d.Instance(a, b || {})
    };
    d.VERSION = "1.0.9", d.defaults = {stop_browser_behavior: {userSelect: "none", touchAction: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)"}}, d.HAS_POINTEREVENTS = a.navigator.pointerEnabled || a.navigator.msPointerEnabled, d.HAS_TOUCHEVENTS = "ontouchstart"in a, d.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i, d.NO_MOUSEEVENTS = d.HAS_TOUCHEVENTS && a.navigator.userAgent.match(d.MOBILE_REGEX), d.EVENT_TYPES = {}, d.UPDATE_VELOCITY_INTERVAL = 16, d.DOCUMENT = a.document;
    var e = d.DIRECTION_DOWN = "down", f = d.DIRECTION_LEFT = "left", g = d.DIRECTION_UP = "up", h = d.DIRECTION_RIGHT = "right", i = d.POINTER_MOUSE = "mouse", j = d.POINTER_TOUCH = "touch", k = d.POINTER_PEN = "pen", l = d.EVENT_START = "start", m = d.EVENT_MOVE = "move", n = d.EVENT_END = "end";
    d.plugins = d.plugins || {}, d.gestures = d.gestures || {}, d.READY = !1;
    var o = d.utils = {extend: function (a, c, d) {
        for (var e in c)a[e] !== b && d || (a[e] = c[e]);
        return a
    }, each: function (a, c, d) {
        var e, f;
        if ("forEach"in a)a.forEach(c, d); else if (a.length !== b) {
            for (e = -1; f = a[++e];)if (c.call(d, f, e, a) === !1)return
        } else for (e in a)if (a.hasOwnProperty(e) && c.call(d, a[e], e, a) === !1)return
    }, inStr: function (a, b) {
        return a.indexOf(b) > -1
    }, hasParent: function (a, b) {
        for (; a;) {
            if (a == b)return!0;
            a = a.parentNode
        }
        return!1
    }, getCenter: function (a) {
        var b = [], c = [];
        return o.each(a, function (a) {
            b.push("undefined" != typeof a.clientX ? a.clientX : a.pageX), c.push("undefined" != typeof a.clientY ? a.clientY : a.pageY)
        }), {pageX: (Math.min.apply(Math, b) + Math.max.apply(Math, b)) / 2, pageY: (Math.min.apply(Math, c) + Math.max.apply(Math, c)) / 2}
    }, getVelocity: function (a, b, c) {
        return{x: Math.abs(b / a) || 0, y: Math.abs(c / a) || 0}
    }, getAngle: function (a, b) {
        var c = b.pageY - a.pageY, d = b.pageX - a.pageX;
        return 180 * Math.atan2(c, d) / Math.PI
    }, getDirection: function (a, b) {
        var c = Math.abs(a.pageX - b.pageX), d = Math.abs(a.pageY - b.pageY);
        return c >= d ? a.pageX - b.pageX > 0 ? f : h : a.pageY - b.pageY > 0 ? g : e
    }, getDistance: function (a, b) {
        var c = b.pageX - a.pageX, d = b.pageY - a.pageY;
        return Math.sqrt(c * c + d * d)
    }, getScale: function (a, b) {
        return a.length >= 2 && b.length >= 2 ? this.getDistance(b[0], b[1]) / this.getDistance(a[0], a[1]) : 1
    }, getRotation: function (a, b) {
        return a.length >= 2 && b.length >= 2 ? this.getAngle(b[1], b[0]) - this.getAngle(a[1], a[0]) : 0
    }, isVertical: function (a) {
        return a == g || a == e
    }, toggleDefaultBehavior: function (a, b, c) {
        if (b && a && a.style) {
            o.each(["webkit", "moz", "Moz", "ms", "o", ""], function (d) {
                o.each(b, function (b, e) {
                    d && (e = d + e.substring(0, 1).toUpperCase() + e.substring(1)), e in a.style && (a.style[e] = !c && b)
                })
            });
            var d = function () {
                return!1
            };
            "none" == b.userSelect && (a.onselectstart = !c && d), "none" == b.userDrag && (a.ondragstart = !c && d)
        }
    }};
    d.Instance = function (a, b) {
        var e = this;
        return c(), this.element = a, this.enabled = !0, this.options = o.extend(o.extend({}, d.defaults), b || {}), this.options.stop_browser_behavior && o.toggleDefaultBehavior(this.element, this.options.stop_browser_behavior, !1), this.eventStartHandler = s.onTouch(a, l, function (a) {
            e.enabled && u.startDetect(e, a)
        }), this.eventHandlers = [], this
    }, d.Instance.prototype = {on: function (a, b) {
        var c = a.split(" ");
        return o.each(c, function (a) {
            this.element.addEventListener(a, b, !1), this.eventHandlers.push({gesture: a, handler: b})
        }, this), this
    }, off: function (a, b) {
        var c, d, e = a.split(" ");
        return o.each(e, function (a) {
            for (this.element.removeEventListener(a, b, !1), c = -1; d = this.eventHandlers[++c];)d.gesture === a && d.handler === b && this.eventHandlers.splice(c, 1)
        }, this), this
    }, trigger: function (a, b) {
        b || (b = {});
        var c = d.DOCUMENT.createEvent("Event");
        c.initEvent(a, !0, !0), c.gesture = b;
        var e = this.element;
        return o.hasParent(b.target, e) && (e = b.target), e.dispatchEvent(c), this
    }, enable: function (a) {
        return this.enabled = a, this
    }, dispose: function () {
        var a, b;
        for (this.options.stop_browser_behavior && o.toggleDefaultBehavior(this.element, this.options.stop_browser_behavior, !0), a = -1; b = this.eventHandlers[++a];)this.element.removeEventListener(b.gesture, b.handler, !1);
        return this.eventHandlers = [], s.unbindDom(this.element, d.EVENT_TYPES[l], this.eventStartHandler), null
    }};
    var p = null, q = !1, r = !1, s = d.event = {bindDom: function (a, b, c) {
        var d = b.split(" ");
        o.each(d, function (b) {
            a.addEventListener(b, c, !1)
        })
    }, unbindDom: function (a, b, c) {
        var d = b.split(" ");
        o.each(d, function (b) {
            a.removeEventListener(b, c, !1)
        })
    }, onTouch: function (a, b, c) {
        var e = this, f = function (f) {
            var g = f.type.toLowerCase();
            if (!o.inStr(g, "mouse") || !r) {
                o.inStr(g, "touch") || o.inStr(g, "pointerdown") || o.inStr(g, "mouse") && 1 === f.which ? q = !0 : o.inStr(g, "mouse") && !f.which && (q = !1), (o.inStr(g, "touch") || o.inStr(g, "pointer")) && (r = !0);
                var h = 0;
                q && (d.HAS_POINTEREVENTS && b != n ? h = t.updatePointer(b, f) : o.inStr(g, "touch") ? h = f.touches.length : r || (h = o.inStr(g, "up") ? 0 : 1), h > 0 && b == n ? b = m : h || (b = n), (h || null === p) && (p = f), c.call(u, e.collectEventData(a, b, e.getTouchList(p, b), f)), d.HAS_POINTEREVENTS && b == n && (h = t.updatePointer(b, f))), h || (p = null, q = !1, r = !1, t.reset())
            }
        };
        return this.bindDom(a, d.EVENT_TYPES[b], f), f
    }, determineEventTypes: function () {
        var a;
        a = d.HAS_POINTEREVENTS ? t.getEvents() : d.NO_MOUSEEVENTS ? ["touchstart", "touchmove", "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], d.EVENT_TYPES[l] = a[0], d.EVENT_TYPES[m] = a[1], d.EVENT_TYPES[n] = a[2]
    }, getTouchList: function (a) {
        return d.HAS_POINTEREVENTS ? t.getTouchList() : a.touches ? a.touches : (a.identifier = 1, [a])
    }, collectEventData: function (a, b, c, d) {
        var e = j;
        return(o.inStr(d.type, "mouse") || t.matchType(i, d)) && (e = i), {center: o.getCenter(c), timeStamp: (new Date).getTime(), target: d.target, touches: c, eventType: b, pointerType: e, srcEvent: d, preventDefault: function () {
            var a = this.srcEvent;
            a.preventManipulation && a.preventManipulation(), a.preventDefault && a.preventDefault()
        }, stopPropagation: function () {
            this.srcEvent.stopPropagation()
        }, stopDetect: function () {
            return u.stopDetect()
        }}
    }}, t = d.PointerEvent = {pointers: {}, getTouchList: function () {
        var a = [];
        return o.each(this.pointers, function (b) {
            a.push(b)
        }), a
    }, updatePointer: function (a, b) {
        return a == n ? delete this.pointers[b.pointerId] : (b.identifier = b.pointerId, this.pointers[b.pointerId] = b), Object.keys(this.pointers).length
    }, matchType: function (a, b) {
        if (!b.pointerType)return!1;
        var c = b.pointerType, d = {};
        return d[i] = c === i, d[j] = c === j, d[k] = c === k, d[a]
    }, getEvents: function () {
        return["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
    }, reset: function () {
        this.pointers = {}
    }}, u = d.detection = {gestures: [], current: null, previous: null, stopped: !1, startDetect: function (a, b) {
        this.current || (this.stopped = !1, this.current = {inst: a, startEvent: o.extend({}, b), lastEvent: !1, lastVelocityEvent: !1, velocity: !1, name: ""}, this.detect(b))
    }, detect: function (a) {
        if (this.current && !this.stopped) {
            a = this.extendEventData(a);
            var b = this.current.inst, c = b.options;
            return o.each(this.gestures, function (d) {
                return this.stopped || c[d.name] === !1 || b.enabled === !1 || d.handler.call(d, a, b) !== !1 ? void 0 : (this.stopDetect(), !1)
            }, this), this.current && (this.current.lastEvent = a), a.eventType == n && !a.touches.length - 1 && this.stopDetect(), a
        }
    }, stopDetect: function () {
        this.previous = o.extend({}, this.current), this.current = null, this.stopped = !0
    }, getVelocityData: function (a, b, c, e) {
        var f = this.current, g = f.lastVelocityEvent, h = f.velocity;
        g && a.timeStamp - g.timeStamp > d.UPDATE_VELOCITY_INTERVAL ? (h = o.getVelocity(a.timeStamp - g.timeStamp, a.center.pageX - g.center.pageX, a.center.pageY - g.center.pageY), f.lastVelocityEvent = a) : f.velocity || (h = o.getVelocity(b, c, e), f.lastVelocityEvent = a), f.velocity = h, a.velocityX = h.x, a.velocityY = h.y
    }, getInterimData: function (a) {
        var b, c, d = this.current.lastEvent;
        a.eventType == n ? (b = d && d.interimAngle, c = d && d.interimDirection) : (b = d && o.getAngle(d.center, a.center), c = d && o.getDirection(d.center, a.center)), a.interimAngle = b, a.interimDirection = c
    }, extendEventData: function (a) {
        var b = this.current, c = b.startEvent;
        (a.touches.length != c.touches.length || a.touches === c.touches) && (c.touches = [], o.each(a.touches, function (a) {
            c.touches.push(o.extend({}, a))
        }));
        var d = a.timeStamp - c.timeStamp, e = a.center.pageX - c.center.pageX, f = a.center.pageY - c.center.pageY;
        return this.getVelocityData(a, d, e, f), this.getInterimData(a), o.extend(a, {startEvent: c, deltaTime: d, deltaX: e, deltaY: f, distance: o.getDistance(c.center, a.center), angle: o.getAngle(c.center, a.center), direction: o.getDirection(c.center, a.center), scale: o.getScale(c.touches, a.touches), rotation: o.getRotation(c.touches, a.touches)}), a
    }, register: function (a) {
        var c = a.defaults || {};
        return c[a.name] === b && (c[a.name] = !0), o.extend(d.defaults, c, !0), a.index = a.index || 1e3, this.gestures.push(a), this.gestures.sort(function (a, b) {
            return a.index < b.index ? -1 : a.index > b.index ? 1 : 0
        }), this.gestures
    }};
    d.gestures.Drag = {name: "drag", index: 50, defaults: {drag_min_distance: 10, correct_for_drag_min_distance: !0, drag_max_touches: 1, drag_block_horizontal: !1, drag_block_vertical: !1, drag_lock_to_axis: !1, drag_lock_min_distance: 25}, triggered: !1, handler: function (a, b) {
        if (u.current.name != this.name && this.triggered)return b.trigger(this.name + "end", a), void(this.triggered = !1);
        if (!(b.options.drag_max_touches > 0 && a.touches.length > b.options.drag_max_touches))switch (a.eventType) {
            case l:
                this.triggered = !1;
                break;
            case m:
                if (a.distance < b.options.drag_min_distance && u.current.name != this.name)return;
                if (u.current.name != this.name && (u.current.name = this.name, b.options.correct_for_drag_min_distance && a.distance > 0)) {
                    var c = Math.abs(b.options.drag_min_distance / a.distance);
                    u.current.startEvent.center.pageX += a.deltaX * c, u.current.startEvent.center.pageY += a.deltaY * c, a = u.extendEventData(a)
                }
                (u.current.lastEvent.drag_locked_to_axis || b.options.drag_lock_to_axis && b.options.drag_lock_min_distance <= a.distance) && (a.drag_locked_to_axis = !0);
                var d = u.current.lastEvent.direction;
                a.drag_locked_to_axis && d !== a.direction && (a.direction = o.isVertical(d) ? a.deltaY < 0 ? g : e : a.deltaX < 0 ? f : h), this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), b.trigger(this.name + a.direction, a);
                var i = o.isVertical(a.direction);
                (b.options.drag_block_vertical && i || b.options.drag_block_horizontal && !i) && a.preventDefault();
                break;
            case n:
                this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
        }
    }}, d.gestures.Hold = {name: "hold", index: 10, defaults: {hold_timeout: 500, hold_threshold: 1}, timer: null, handler: function (a, b) {
        switch (a.eventType) {
            case l:
                clearTimeout(this.timer), u.current.name = this.name, this.timer = setTimeout(function () {
                    "hold" == u.current.name && b.trigger("hold", a)
                }, b.options.hold_timeout);
                break;
            case m:
                a.distance > b.options.hold_threshold && clearTimeout(this.timer);
                break;
            case n:
                clearTimeout(this.timer)
        }
    }}, d.gestures.Release = {name: "release", index: 1 / 0, handler: function (a, b) {
        a.eventType == n && b.trigger(this.name, a)
    }}, d.gestures.Swipe = {name: "swipe", index: 40, defaults: {swipe_min_touches: 1, swipe_max_touches: 1, swipe_velocity: .7}, handler: function (a, b) {
        if (a.eventType == n) {
            if (a.touches.length < b.options.swipe_min_touches || a.touches.length > b.options.swipe_max_touches)return;
            (a.velocityX > b.options.swipe_velocity || a.velocityY > b.options.swipe_velocity) && (b.trigger(this.name, a), b.trigger(this.name + a.direction, a))
        }
    }}, d.gestures.Tap = {name: "tap", index: 100, defaults: {tap_max_touchtime: 250, tap_max_distance: 10, tap_always: !0, doubletap_distance: 20, doubletap_interval: 300}, has_moved: !1, handler: function (a, b) {
        var c, d, e;
        a.eventType == l ? this.has_moved = !1 : a.eventType != m || this.moved ? a.eventType == n && "touchcancel" != a.srcEvent.type && a.deltaTime < b.options.tap_max_touchtime && !this.has_moved && (c = u.previous, d = c && c.lastEvent && a.timeStamp - c.lastEvent.timeStamp, e = !1, c && "tap" == c.name && d && d < b.options.doubletap_interval && a.distance < b.options.doubletap_distance && (b.trigger("doubletap", a), e = !0), (!e || b.options.tap_always) && (u.current.name = "tap", b.trigger(u.current.name, a))) : this.has_moved = a.distance > b.options.tap_max_distance
    }}, d.gestures.Touch = {name: "touch", index: -1 / 0, defaults: {prevent_default: !1, prevent_mouseevents: !1}, handler: function (a, b) {
        return b.options.prevent_mouseevents && a.pointerType == i ? void a.stopDetect() : (b.options.prevent_default && a.preventDefault(), void(a.eventType == l && b.trigger(this.name, a)))
    }}, d.gestures.Transform = {name: "transform", index: 45, defaults: {transform_min_scale: .01, transform_min_rotation: 1, transform_always_block: !1, transform_within_instance: !1}, triggered: !1, handler: function (a, b) {
        if (u.current.name != this.name && this.triggered)return b.trigger(this.name + "end", a), void(this.triggered = !1);
        if (!(a.touches.length < 2)) {
            if (b.options.transform_always_block && a.preventDefault(), b.options.transform_within_instance)for (var c = -1; a.touches[++c];)if (!o.hasParent(a.touches[c].target, b.element))return;
            switch (a.eventType) {
                case l:
                    this.triggered = !1;
                    break;
                case m:
                    var d = Math.abs(1 - a.scale), e = Math.abs(a.rotation);
                    if (d < b.options.transform_min_scale && e < b.options.transform_min_rotation)return;
                    u.current.name = this.name, this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), e > b.options.transform_min_rotation && b.trigger("rotate", a), d > b.options.transform_min_scale && (b.trigger("pinch", a), b.trigger("pinch" + (a.scale < 1 ? "in" : "out"), a));
                    break;
                case n:
                    this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
            }
        }
    }}, "function" == typeof define && define.amd ? define(function () {
        return d
    }) : "object" == typeof module && module.exports ? module.exports = d : a.Hammer = d
}(window);
//