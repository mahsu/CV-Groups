"use strict";
var log = require('../logger.js');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');
var nodeUrl = require('url');
var fs = require('fs');
var config = require('../config.js');
var schema = require('../models/schema.js');
var stylesheetLocation = "../res/custom.css";
var backpageLocation = config.host+"/pdfdata/res/backpage.html";
var customStylesheet = '<link rel="stylesheet" href=' + stylesheetLocation + ' />';

var scrape = {
    init: function (req, res) {
        scrape.getRequestParams(req, function(err, URL_LIST, htmlData) {
            if (err)
                log.error(err);
            if (URL_LIST) {
                var finalTest = new schema.user({
                    urlList: URL_LIST
                });
                
                finalTest.save(function (err,result) {
                 if (err) log.error(err);
                 log.info('All files have been processed successfully');
                 fs.writeFile("data/htmlfiles/"+ result.id+".html", htmlData, function (err) {
                     if (err) {
                         return log.error(err);
                     }
                 });    
                 res.send(result.id);
                });
            }
        });    
    },
    getRequestParams: function (req, callback) {
        var requestBody = req.body;
        log.info(req);
        if (requestBody.URL) {
            if (backpageLocation) {
                requestBody.URL.push(backpageLocation);
            }
            var wrapped = requestBody.URL.map(function (value, index) {
                return { index: index, value: value };
            });
            async.map(wrapped, function (url,cb) {
                request(url.value, function (error, response, body) {
                    if (error) {
                        log.error('Error:', error);
                        cb("", "");
                    }
                    else if (response.statusCode !== 200) {
                        log.error('Invalid Status Code Returned:', response.statusCode);
                        cb("", "");
                    }
                    else {
                        scrape.parseHtml(url.value, body, url.index, function (err, res) {
                            if (err)
                                log.error(err);
                            cb(error, res);
                        });
                    }                
                });
            }, function (err,res) {
                if (err) {
                  log.info('A file failed to process');
                }             
                callback(null, requestBody.URL, res.join(' ')+"</body>");
            });         
        }
        else {
            log.error("URL required ");
        }
    },
    parseHtml: function (url, body, index, cb) {
        var $ = cheerio.load(body);
        var title = $('title').text();
        var htmlData = "";
        var pageBreak = '<footer></footer>'

        if (title.indexOf("404") != 0) {
            $('link').each(function (i, elem) {
                $(elem).attr('href', nodeUrl.resolve(url, $(elem).attr('href')));
            });
                
            //processing all the other links
            $('a').each(function (i, elem) {
                if ($(elem).attr('href') != null) {
                    if ($(elem).attr('href').charAt(0) != '#') {
                        $(elem).attr('href', nodeUrl.resolve(url, $(elem).attr('href')));
                    }
                }
            });
                
            $('img').each(function (i, elem) {
                if ($(elem).attr('src') != null)
                    $(elem).attr('src', nodeUrl.resolve(url, $(elem).attr('src')));
            });
            if (index == 0) {
                var headHtml = "<head>" + $('head').html() + "</head>";
                var headerHtml = "<header>" + $('header').html() + "</header>";
                var bodyHtml = "<body>";
                htmlData = headHtml + customStylesheet + headerHtml + bodyHtml + $('article').html() + pageBreak;
            }
            else {
                htmlData = $('article').html() + pageBreak;
            }
            cb(null, htmlData);
        }
        else {
            cb("URL data is not reachable - 404");
        }
    }
};
module.exports = scrape;