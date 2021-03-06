"use strict";
/*global angular*/
/*global hljs*/

(function () {

    var app = angular.module("pyblishApp", ["ngRoute",
                                            "ui.utils",
                                            "ui.bootstrap",
                                            "restangular"]);

    app.run(function ($rootScope, $location, $anchorScroll, $window) {
        $anchorScroll.yOffset = 130;

        $rootScope.scrollTo = function (id) {
            console.log("Helo");
            var old = $location.hash();

            $location.hash(id);
            $anchorScroll();
            $location.hash(old);
        };

        $window.viewportUnitsBuggyfill.init();

    });

    app.filter('titlecase', function () {
        return function (s) {
            s = (s === undefined || s === null) ? '' : s;
            return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
                return ch.toUpperCase();
            });
        };
    });

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "static/views/home.html",
                controller: "homeController",
                controllerAs: "ctrl"
            })
            .when("/kits", {
                templateUrl: "static/views/kits.html"
            })
            .when("/pricing", {
                templateUrl: "static/views/pricing.html",
                controller: "priceController",
                controllerAs: "ctrl"
            })
            .when("/guide", {
                redirectTo: function() {
                    console.log("Hello");
                    window.location = "http://forums.pyblish.com/t/learning-pyblish-by-example";
                }
            })
            .when("/about", {
                templateUrl: "static/views/about.html"
            })
            .when("/jobs", {
                templateUrl: "static/views/jobs.html"
            })
            .when("/404", {
                templateUrl: "static/views/404.html"
            })
            .otherwise({
                redirectTo: "/404"
            });

        $locationProvider.html5Mode(true);
    });

    app.controller("homeController", function ($sce) {
        var self,
            persons,
            companies;

        // hljs.initHighlighting();

        self = this;

        self.showPlayer = false;
        self.playerUrl = $sce.trustAsResourceUrl("https://www.youtube.com/embed/j5uUTW702-U?rel=0&amp;showinfo=0&hd=1&vq=hd720");

        companies = {
            realise: {
                name: "Realise",
                logo: "static/img/companies/realise.png",
                link: "http://www.realisestudio.com/",
                employees: "10-20"
            },
            caoz: {
                name: "CAOZ",
                logo: "static/img/companies/caoz.png",
                link: "http://www.caoz.com",
                employees: "50-80",
            },
            colorbleed: {
                name: "Colorbleed",
                logo: "static/img/companies/colorbleed.png",
                link: "http://www.colorbleed.nl",
                employees: "2-15",
            },
            bait: {
                name: "Bait Studio",
                logo: "static/img/companies/bait.png",
                link: "http://www.baitstudio.com/",
                employees: "10-20",
            },
            ttgames: {
                name: "TT Games",
                logo: "static/img/companies/ttgames.png",
                link: "http://www.ttgames.com/",
                employees: "200-300",
            },
            filmgate: {
                name: "Filmgate",
                logo: "static/img/companies/filmgate.png",
                employees: "2-15",
            },
            kredenc: {
                name: "Kredenc",
                logo: "static/img/companies/kredenc.png",
                link: "http://www.kredenc.org",
                employees: "2-15",
            },
            primefocus: {
                name: "Prime Focus",
                logo: "static/img/companies/primefocus.png",
                link: "http://www.primefocus.com",
                employees: "200-300",
            },
            bumpybox: {
                name: "Bumpybox",
                logo: "static/img/companies/bumpybox.png",
                link: "http://www.bumpybox.com",
                employees: "3-10"
            },
            clothcat: {
                name: "Cloth Cat Animation",
                logo: "static/img/companies/clothcat.png",
                link: "http://www.bumpybox.com",
                employees: "3-10"
            },
        };

        // Persons, by GitHub id
        persons = {
            tokejepsen: {
                name: "Toke Jepsen",
                role: "Technical Director"
            },
            davidmartinezanim: {
                name: "David Martinez",
                role: "Character TD"
            },
            larsbijl: {
                name: "Lars van der Bijl",
                role: "Head of Pipeline"
            },
            bigroy: {
                name: "Roy Nieterau",
                role: "Director"
            },
            svenni: {
                name: "Sveinbjörn J. Tryggvason",
                role: "Pipeline Overlord"
            },
            mkolar: {
                name: "Milan Kolar",
                role: "VFX Supervisor"
            },
            ljkart: {
                name: "Liju Kunnummal",
                role: "Pipeline Developer"
            }
        };

        self.companies = [
            {company: companies.realise, height: 30},
            {company: companies.caoz, height: 30},
            {company: companies.colorbleed, height: 40},
            {company: companies.bait, height: 30},
            // {company: companies.ttgames, height: 60},
            {company: companies.filmgate, height: 40},
            {company: companies.kredenc, height: 60},
            {company: companies.bumpybox, height: 60},
            {company: companies.clothcat, height: 60},
        ];

        self.software = [
            {src: "static/img/software/maya.png", height: 60, tooltip: "Autodesk Maya"},
            {src: "static/img/software/softimage.png", height: 30, tooltip: "Autodesk Softimage"},
            {src: "static/img/software/3dsmax.png", height: 35, tooltip: "Autodesk 3ds Max"},
            {src: "static/img/software/nuke.png", height: 50, tooltip: "The Foundry Nuke"},
            {src: "static/img/software/modo.png", height: 25, tooltip: "The Foundry Modo"},
            {src: "static/img/software/clarisse.png", height: 25, tooltip: "Isotropix Clarisse"},
            {src: "static/img/software/houdini.png", height: 50, tooltip: "SideFx Houdini"},
            {src: "static/img/software/ftrack.png", height: 30, tooltip: "Ftrack"},
            {src: "static/img/software/shotgun.png", height: 25, tooltip: "Shotgun"},
        ];

        self.stories = [
            {
                story: "I love Pyblish!",
                company: companies.ttgames,
                person: persons.davidmartinezanim
            },
            {
                story: "Pyblish is an ideal framework that modularises \
                        publishing workflow for visual effects by use \
                        of small functions and clear data types while \
                        providing wide-ranging functionality. ",
                company: companies.realise,
                person: persons.larsbijl,
            },
            {
                story: "Pyblish is what enables our artists to focus more \
                        on the artistic barrier of raising quality instead \
                        of the technical one whilst maintaining a pipeline \
                        that raises the bar for both.",
                company: companies.colorbleed,
                person: persons.bigroy,
            },
            {
                story: "I'm boarding this ship.",
                company: companies.kredenc,
                person: persons.mkolar,
            },
            {
                story: "Clean, small yet powerful. Redefined the way content has been saved and visualized.",
                company: companies.primefocus,
                person: persons.ljkart,
            },
            {
                story: "Working across multiple pipelines, Pyblish is \
                        a much needed common framework. Pyblish allows \
                        me to fix problems in one production and instantly \
                        propagate the solutions to other productions.",
                company: companies.bait,
                person: persons.tokejepsen,
            },
            {
                story: "I am really excited about using Pyblish on our next production.",
                company: companies.caoz,
                person: persons.svenni,
            },
        ];
    });
}());