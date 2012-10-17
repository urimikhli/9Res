﻿
    animatedcollapse.addDiv('hdr2', 'fade=0,speed=400,height=128px,hide=1');
    animatedcollapse.ontoggle = function ($, divobj, state) { //fires each time a DIV is expanded/contracted
        //$: Access to jQuery
        //divobj: DOM reference to DIV being expanded/ collapsed. Use "divobj.id" to get its ID
        //state: "block" or "none", depending on state
    }
    function info_mouse_over(td_obj) {
        if (td_obj.className == "hdr_info3") { td_obj.className = "hdr_info4"; } else { td_obj.className = "hdr_info2"; }
    }
    function info_mouse_out(td_obj) {
        if (td_obj.className == "hdr_info4") { td_obj.className = "hdr_info3"; } else { td_obj.className = "hdr_info1"; }
    }
    function info_mouse_click(td_obj) {
        if (td_obj.className == "hdr_info1") { n = "hdr_info3"; animatedcollapse.toggle('hdr2'); }
        if (td_obj.className == "hdr_info2") { n = "hdr_info4"; animatedcollapse.toggle('hdr2'); }
        if (td_obj.className == "hdr_info3") { n = "hdr_info1"; animatedcollapse.toggle('hdr2'); }
        if (td_obj.className == "hdr_info4") { n = "hdr_info2"; animatedcollapse.toggle('hdr2'); }
        td_obj.className = n;
    }
    animatedcollapse.init();

    $(document).ready(function () {
        $("input#txt_O_Industry1").autocomplete({ source: ["brett", "bob", "balkan"] });
    });

    function getEl(htm_obj) {
        var x = document.getElementById(htm_obj);
        switch (x.type) {
            case "text": return x.value;
            case "select-one": return x.options[x.selectedIndex].value;
            default: return x.type + "??";
        }
    }

    function sort_unique(arr) {
        arr = arr.sort(function (a, b) { return a * 1 - b * 1; });
        var ret = [arr[0]];
        for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
            if (arr[i - 1] !== arr[i]) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }

    // this is a jquery unique-sorted-array function
    var f = _.compose(_.uniq, function (resValArray) { return _.sortBy(resValArray, _.identity); });


    var resVal;
    var resRaw;

    function showKW(resVal_str, searchLtr) {
        var alpha = "abcdefghijklmnopqrstuvwxyz";
        var alpha_UC = "ABCDEFGHIJKLMNOPQRSTUVWXYZA";
        var i;
        //	var alpha_num=0;
        var firstLetter;  //the first letter of the current array entry
        var altCount = 1;
        var lastLetter = "";  //the first letter of the previous array entry
        var firstLetterUC;
        var kwArray = resVal_str.split("~");
        for (i = 0; i < kwArray.length; i++) {
            firstLetter = kwArray[i].charAt(0);
            if (firstLetter == "<") { firstLetter = kwArray[i].charAt(kwArray[i].search(">") + 1); }
            if (alpha.search(firstLetter) < 0) { firstLetter = "#"; }
            if (firstLetter != lastLetter) {
                if (searchLtr == " ") {
                    kwArray[i] = "</td></tr><tr><td class=\"kw_alpha" + altCount + "\"><a id=\"kw" + firstLetter.toUpperCase() + "\">" + firstLetter.toUpperCase() + "</a></td><td class=\"kw_words" + altCount + "\">" + kwArray[i];
                    altCount = Math.abs(altCount - 1);
                }
                else if (firstLetter == searchLtr)
                { kwArray[i] = "</td></tr><tr><td class=\"kw_alpha_sel\"><a id=\"kw" + firstLetter.toUpperCase() + "\">" + firstLetter.toUpperCase() + "</a></td><td class=\"kw_words_sel\">" + kwArray[i]; }
                else { kwArray[i] = "</td></tr><tr><td class=\"kw_alpha_usel\"><a id=\"kw" + firstLetter.toUpperCase() + "\">" + firstLetter.toUpperCase() + "</a></td><td class=\"kw_words_usel\">" + kwArray[i]; }
                //				alpha_num += 1;
                lastLetter = firstLetter;
            }


        }
        var numRow;
        var kwArray_alpha = kwArray.join(", ");
        kwArray_alpha = "<table id=\"resTable\"><tr><td class=\"kw_header\" colspan=2>Distinct List of Keywords On Your Resume (cool, huh?)" + kwArray_alpha + "</td></tr></table>";

        document.getElementById("ppane_kw").innerHTML = kwArray_alpha;
        document.getElementById("ppane_kw").scrollTop = scrollTable(searchLtr);
    }

    function scrollTable(searchLtr) {
        var tbl = document.getElementById("resTable");
        var alpha = "#abcdefghijklmnopqrstuvwxyz";
        var offsetVal = 1;
        var scrollHeight = tbl.rows[0].offsetHeight;
        while (alpha.charAt(offsetVal) != searchLtr) {
            scrollHeight += tbl.rows[offsetVal].offsetHeight
            offsetVal += 1;
        }
        // if (scrollHeight > 25) { scrollHeight -= 25;}
        return scrollHeight;
    }

    function trim(str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }

    // if the user typed in a word followed by a space, we have to make sure we've added any phrases that might match!
    function kwAddPhrase() {
        var search_num;
        var inpResRaw = resRaw;
        var search_val = document.getElementById("txt_kwSearch").value.toLowerCase();
        var search_len = search_val.length;
        var counter = 0;
        var phrases = "";
        var subSearch = -1;
        var str_pos;

        // first, do we already have this phrase?  if not, we can quit.
        if (resVal.search(search_val) == -1) {
            // otherwise, find the first instance in our raw data
            search_num = inpResRaw.search(" " + search_val);
            // and keep going until you stop!
            while (search_num != -1) {
                // whenever we find a value, we need to cut off everything up to that point, to avoid redundant searching
                inpResRaw = inpResRaw.substring(search_num + search_len + 1);
                // find the next word and put it in our subArray
                subSearch = inpResRaw.search(" ");
                if (subSearch != -1) { phrases += search_val + inpResRaw.substring(0, subSearch) + "~"; }
                search_num = inpResRaw.search(" " + search_val);
            }

            // if we didn't find any matches, we can quit
            if (phrases != "") {
                // get a sorted/distinct list of the phrases we found
                phrases = f(phrases.split("~")).join("~");
                // find our initial value's location in our sort/distinct array, and add us in!
                str_pos = resVal.search("~" + trim(search_val));
                resVal = resVal.substring(0, str_pos + trim(search_val).length + 1) + phrases + resVal.substring(str_pos + trim(search_val).length + 1);
            }
        }
    }

    function kwSearchParent(kCode) {
        //alert("ow");
        // if they hit enter and this is an add-able word, then add it!
        if (kCode == "13" && document.getElementById("add_kw").className == "kw_addval") {
            kwAdd();
        } else { kwSearch(); }
    }

    function kwSearch() {
        var val;
        var inpResVal;
        var search_num;
        var startwith = 0;
        var outResVal = "";
        var val_length;
        var alpha = "abcdefghijklmnopqrstuvwxyz";
        var first_search_letter = " ";
        var first_position = 0;
        var found_kw = -1;
        var word_plus_space = 0;
        var str_val;
        // strip out any commas

        str_val = document.getElementById("txt_kwSearch").value;
        str_val = str_val.replace(",", "");
        document.getElementById("txt_kwSearch").value = str_val;
        if (trim(str_val.toLowerCase()) != "") {
            val = "~" + document.getElementById("txt_kwSearch").value.toLowerCase();
            if (val == trim(val) + " ") { kwAddPhrase(); }
            inpResVal = resVal;
            val = trim(val);
            first_search_letter = val.charAt(1);
            if (alpha.search(first_search_letter) < 0) { first_search_letter = "#"; }
            val_length = val.length;
            if (val_length > 2) {
                // search for the first instance of the string
                search_num = inpResVal.search(val);
                outResVal = "";
                found_kw = 0;
                if (search_num >= 0) {
                    // okay, we have at least *something* -- let's see if we have this exact phrase
                    if (inpResVal.substring(search_num + val.length, search_num + val.length + 1) == "~") { found_kw = 1; }

                    // while we've found another instance of this string, keep going
                    while (search_num >= 0) {
                        // our built string is equal to everything up to this string, plus the newly-formatted search value
                        outResVal += inpResVal.substring(0, search_num + 1) + "<span class=\"kw_sel\">" + inpResVal.substring(search_num + 1, search_num + val_length) + "</span>";
                        // and what's left is everything after this value.
                        inpResVal = inpResVal.substring(search_num + val_length);
                        // now look for the next one!
                        search_num = inpResVal.search(val);
                    }
                }
            }
        }
        else { inpResVal = resVal; }

        outResVal += inpResVal;

        if (found_kw == 1) {
            document.getElementById("add_kw").className = "kw_foundval";
            document.getElementById("txt_kwSearch").type = "text_found";
        }
        else if (found_kw == 0) {
            document.getElementById("add_kw").className = "kw_addval";
            document.getElementById("txt_kwSearch").type = "text";
        }
        else {
            document.getElementById("add_kw").className = "kw_enterval";
            document.getElementById("txt_kwSearch").type = "text";
        }
        showKW(outResVal, first_search_letter);

        // alert(document.getElementById("ppane_kw").innerHTML);

    }
    function displayRes() {
        resRaw = "fifteen years experience implementing business intelligence solutions to fulfill a wide array of business objectives This includes expertise upon all project phases from defining the initial approach to designing and implementing the solution to incorporating the solution into normal business operations Akamai Technologies Business Intelligence Architect present Cambridge MA Developing Robot Akamai’s Revenue Forecasting system which is used to generate company revenue forecasts announced each quarter to Wall Street analysts This system forecasts internet traffic for every Akamai client identifying client-specific trending and seasonality It then runs these forecasts through our Invoicing system to generate a very detailed revenue forecast In its first quarter of operations Revenue was forecasted within 1% a substantial improvement over Akamai’s historical 5-8% forecast accuracy Developed Bubble Chart a system for Akamai’s Deal Desk to properly determine mathematical price curves based upon a variety of market conditions Lenovo Corp Business Intelligence Consultant Durham NC Proposed designed and developed LGOS Lenovo Global Order Status a reporting application that handles all Lenovo order reporting for internal business users external partners and major customers Built a data model and reporting system AppTracker for Lenovo to track and report upon over five thousand IBM and Lenovo business applications This is part of its strategy to fully separate Lenovo's business activities from IBM's and to migrate Lenovo to its own long-term IT platform M|C Communications Business Intelligence Consultant Boston MA Conducted extensive interviews with upper level management throughout the organization to precisely define its business nomenclature e g product account event stage track etc Once precise definitions were defined this nomenclature was published and distributed throughout the organization Designed and implemented SLX?Report M|C’s enterprise-wide sales reporting system This reporting system provides up-to-the-minute sales reporting across the entire organization using the unified business nomenclature Integrated SLX-Report into the company's operations management system to automatically notify operations project leaders and help define a proper sales commissions policy further unifying M|C’s business processes Canberra Business Intelligence Consultant Meriden CT Developed and implemented Prospector a global Business Intelligence system that merges business activity from seven sales offices and six manufacturing plants in the United States Belgium Canada Denmark France Germany Japan Russia and the United Kingdom Prospector allows upper management to see total company sales on an up-to-the-moment basis in any currency used within the organization It also provides tight coordination between sales offices and manufacturing plants to quickly route sales to the optimal manufacturing plant This routing process uses a sophisticated algorithm that assesses the customer’s desired delivery date current plant utilization levels the specific items ordered plant/customer proximity and even country-specific customs issues Prospector’s global implementation involved designing over-arching data flow diagrams illustrating the entire lifecycle of all data flowing into the company through validation normalization aggregation and into the data warehouse full network topologies illustrating every machine connection application protocol and operating system logical and physical data models and ETL documentation standards used by on-site warehousing teams in each country Serono EMD Business Intelligence Consultant Rockland MA Oversaw end-to-end architectural design for all aspects of CAPS Merck Serono’s Business Intelligence system which integrates pharmaceutical data from its US and Switzerland-based sales offices along with data purchased from two pharmaceutical data providers CAPS allows product managers to conduct competitive analysis for all drugs in a given therapeutic area e g Neurology Reproductive Health etc using precise sales data for all competing drugs through the end of the previous month and precise sales data for its own drugs through the end of the previous day for all US and European sales CAPS also uses complex formulas to estimate current inventory levels at third party distribution centers who were prone to loading up on a product whenever EMD Serono offered a discount thereby skewing the firm’s ability to calculate current demand This data is integrated with EMD Serono’s order entry system to limit each distribution center’s DOI day of inventory level As an aside one distribution center commented that EMD Serono had a better sense of the center’s inventory levels than they had themselves: flattering news for any reporting initiative! Met routinely with business leaders in multiple departments including Finance Supply Chain Management and Sales to discuss current and future reporting requirements illustrate how to fulfill these requirements with the existing enterprise architecture and propose architectural changes to better meet future requirements Verispan Inc Business Intelligence Consultant Waltham MA Solely responsible for all aspects of designing and implementing a customer-facing reporting system for specialty pharmaceutical data This process started with raw data files and ended with fully populated materialized views of normalized aggregated validated data from which reports could be easily generated Developed a metadata-driven Intranet site which the Verispan sales force used to evaluate the present status of the data warehouse at any time The site was automatically updated upon the addition of all new data to the data warehouse without any required human intervention Investment Technology Group Business Intelligence Consultant Boston MA Worked with a small team that designed and implemented an enterprise-wide data warehouse from initial requirements gathering through logical and physical modeling to the actual implementation This data warehouse integrates ITG’s voluminous trading data tens of millions of trades per day with its CRM system invoicing data and home-grown departmental data into a single consistent fully-cleaned and normalized reporting warehouse Upgraded the existing warehouse to provide as was reporting to allow Investment Technology Group to leverage its warehouse for all SEC-required historical compliance reports As was reporting allows users to generate reports precisely how they would have appeared if generated from any point in the past Solely responsible for all aspects of designing documenting and implementing a multi-server data warehousing environment both in development using PowerMart and then in production using PowerCenter This included hardware procurement software installation creation of the Informatica repositories configuration security and performance tuning Designed and implemented over sixty Informatica PowerCenter PowerMart mappings using virtually every type of built-in transformation normalizer expression rank router aggregator joiner advanced external procedures et al These mappings include sophisticated business logic such as several types of slowly changing dimensions in-depth session control logic heterogenous sources heterogeneous targets Informatica 6 0 only and the generation of intra-session control totals Palm Computing Business Intelligence Consultant Cambridge MA Oversaw Palm Computing’s effort to design and implement a hybrid Oracle MySQL data warehouse to store all of Palm’s web logs application logs and wireless user information This involved the creation of countless PL/SQL ETL scripts to clean normalize and aggregate data from disparate sources and load this data into a single fully-normalized data warehouse Designed a reporting data warehouse schema to effectively balance management’s demand for speedy reports with the necessity for reasonable daily back-end processing performance Developed and implemented an ad-hoc reporting web application which Palm’s marketing and finance departments used to analyze and manipulate up-to-date reporting data Akamai Technologies Technical Team Lead Cambridge MA Solely responsible for overseeing the redesign of the back end of Akamai Reporter 1 9 Reporter is Akamai’s customer-facing reporting system which allows customers such as Yahoo! CNN Apple and Microsoft to generate performance reports about their website and streaming activity Reporter 1 9 involved coordinating an entire rewrite of the report generation code and SQL statements as well as some restructuring of the database schema to speed data extraction from a partitioned Oracle 8 database This redesign resulted in report generation times improving by a factor of 2 to 10 times Ported Akamai’s ETL logic from Perl to PL/SQL optimized the normalization process and tuned SQL*Loader scripts which resulted in a decrease in load time by almost two orders of magnitude Akamai Technologies Database Application Developer Cambridge MA Led a team of five engineers in the development and maintenance of Akamai Problem Solver Akamai’s online customer-facing troubleshooting knowledge base Performed the Oracle installation all physical and logical database design and oversaw all front-end development Worked with a team of two consultants and a project manager to develop Ask Akamai Akamai’s document management system which allows ad-hoc searches of Akamai’s document base along with proper workflow validation i e managers can request to approve all documents submitted by their employees Performed all database design & installation web page development and hardware procurement Designed and implemented Akamai’s original invoicing system This project involved substantial data cleansing and data aggregation at the time it was implemented Akamai was still entering contract information into the database manually a highly error-prone process"
        resRaw += "Oracle Corporation Senior Member of the Technical Staff Waltham MA Proposed designed and developed Oracle Express Query Statistics a 3-tier reporting application for Oracle customers to monitor the performance of Oracle Express data warehouses This tool gathered statistics in Oracle Express inserted them into one of six supported RDBMS’s and allowed customers to generate reports through a query-by-example user interface Solely responsible for all facets of design and development of this application from its inception through two subsequent releases which included testing & optimization for seven different relational database platforms Developed a tool to dynamically translate complex Oracle DDL DCL and DML SQL statements into formats readable by six other relational database platforms Maintained Relational Access Administrator an Oracle application that allows customers to automatically load Oracle RDBMS schemas into Oracle Express Oracle’s multi-dimensional database This included porting the code from Visual Basic to Java so that it could integrate with Oracle Enterprise Manager’s web interface Clark University Database Instructor Woburn MA Instructed evenings & weekends class on Oracle database administration Topics included proper schema design normalization concepts PL/SQL development and SQL performance tuning IMS Business Intelligence Consultant Philadelphia PA Worked on a small development team to design develop and implement a data warehouse and reporting system This warehouse was a combination of relational and multi-dimensional databases and was used to store information on a wide range of statistics and properties of pharmaceutical products BellSouth Report Developer Atlanta GA Wrote a shell-script bug-tracking system for BellSouth to handle bugs in its AIX billing system Automated the generation of performance reports from BellSouth’s AS/400 billing database Performed system administration & bug fixing for Bell South’s billing system";

        resRaw += " " + document.getElementById("bkw").value + " ";

        resRaw = resRaw.toLowerCase();
        var resArray = f(resRaw.split(" "));
        //    var resRaw = "0, 1, 1, 10, 2, 3-tier, 5-8, 6, 8, 9, Aa, ability, about, access, account, accuracy, across, activities, activity, actual, ad-hoc, addition, administration, administrator, advanced, aggregate, aggregated, aggregation, aggregator, aix, akamai, akamai’s, al, algorithm, all, allow, allowed, allows, almost, along, also, an, analysis, analysts, analyze, and, announced, any, appeared, apple, application, applications, approach, approve, apptracker, architect, architectural, architecture, area, array, as, as/400, aside, ask, aspects, assesses, at, atlanta, automated, automatically, Bback, back-end, balance, base, based, basic, basis, be, belgium, bell, bellsouth, bellsouth’s, better, between, billing, boston, both, bubble, bug, bug-tracking, bugs, built, built-in, business, by, Ccalculate, cambridge, can, canada, canberra, caps, center, centers, center’s, chain, changes, changing, chart, clark, class, clean, cleansing, client, client-specific, cnn, code, combination, commented, commissions, communications, company, company's, competing, competitive, complex, compliance, computing, computing’s, concepts, conditions, conduct, conducted, configuration, connection, consistent, consultant, consultants, contract, control, coordinating, coordination, corp, corporation, could, countless, country, country-specific, creation, crm, ct, currency, current, curves, customer-facing, customers, customer’s, customs, Ddaily, data, database, databases, date, day, dcl, ddl, deal, decrease, define, defined, defining, definitions, delivery, demand, denmark, departmental, departments, design, designed, designing, desired, desk, detailed, determine, develop, developed, developer, developing, development, diagrams, different, dimensions, discount, discuss, disparate, distributed, distribution, dml, document, documentation, documenting, documents, doi, drugs, durham, dynamically, Ee, each, easily, effectively, effort, emd, employees, end, end-to-end, ended, engineers, entering, enterprise, enterprise-wide, entire, entry, environment, error-prone, estimate, et, etc, etl, european, evaluate, even, evenings, event, every, existing, experience, expertise, express, expression, extensive, external, extraction, Ffacets, factor, fifteen, files, finance, firm’s, first, five, fixing, flattering, flow, flowing, for, force, forecast, forecasted, forecasting, forecasts, formats, formulas, france, from, front-end, fulfill, full, fully, fully-cleaned, fully-normalized, further, future, Gg, ga, gathered, gathering, generate, generated, generation, germany, given, global, group, Hhad, handle, handles, hardware, have, health, help, heterogeneous, heterogenous, highly, historical, home-grown, how, human, hybrid, Ii, ibm, ibm's, identifying, if, illustrate, illustrating, implement, implementation, implemented, implementing, improvement, improving, ims, in, in-depth, inc, inception, include, included, includes, including, incorporating, informatica, information, initial, initiative!, inserted, installation, instructed, instructor, integrate, integrated, integrates, intelligence, interface, internal, internet, intervention, interviews, into, intra-session, intranet, inventory, investment, invoicing, involved, is, issues, it, items, itg’s, its, Jjapan, java, joiner, Llead, leaders, led, lenovo, lenovo's, level, levels, leverage, lgos, lifecycle, limit, load, loading, logic, logical, logs, long-term, Mma, machine, magnitude, maintained, maintenance, major, management, management’s, manager, managers, manager’s, manipulate, manually, manufacturing, mappings, market, marketing, materialized, mathematical, meet, member, merck, merges, meriden, met, metadata-driven, microsoft, migrate, millions, model, modeling, models, monitor, month, multi-dimensional, multi-server, multiple, mysql, m|c, m|c’s, Nnc, necessity, network, neurology, new, news, nomenclature, normal, normalization, normalize, normalized, normalizer, notify, Oobjectives, of, offered, offices, on, on-site, once, one, online, only, operating, operations, optimal, optimization, optimized, oracle, oracle’s, order, ordered, orders, organization, original, other, our, over, over-arching, oversaw, overseeing, own, Ppa, page, palm, palm’s, part, partitioned, partners, party, past, per, performance, performed, perl, pharmaceutical, phases, philadelphia, physical, pl/sql, plant, plant/customer, plants, platform, platforms, point, policy, populated, ported, porting, powercenter, powermart, precise, precisely, present, previous, price, problem, procedures, process, processes, processing, procurement, product, production, products, project, prone, proper, properly, properties, propose, proposed, prospector, prospector’s, protocol, provide, providers, provides, proximity, published, purchased, Qquarter, query, query-by-example, quickly, Rrange, rank, raw, rdbms, rdbms’s, readable, reasonable, redesign, relational, releases, report, reporter, reporting, reports, repositories, reproductive, request, required, requirements, responsible, restructuring, resulted, revenue, rewrite, robot, rockland, route, router, routinely, routing, runs, russia, Ssales, schema, schemas, scripts, searches, seasonality, sec-required, security, see, senior, sense, separate, serono, serono’s, session, seven, several, shell-script, single, site, six, sixty, skewing, slowly, slx-report, slx?report, small, so, software, solely, solution, solutions, solver, some, sophisticated, sources, south’s, specialty, specific, speed, speedy, sql, sql*loader, staff, stage, standards, started, statements, states, statistics, status, still, store, strategy, streaming, street, submitted, subsequent, substantial, such, supply, supported, switzerland-based, system, Ttargets, team, teams, technical, technologies, technology, tens, testing, than, that, the, their, them, themselves:, then, therapeutic, thereby, these, they, third, this, thousand, through, throughout, tight, time, times, to, tool, topics, topologies, total, totals, track, trades, trading, traffic, transformation, translate, trending, troubleshooting, tuned, tuning, two, type, types, Uunified, unifying, united, university, up, up-to-date, up-to-the-minute, up-to-the-moment, updated, upgraded, upon, upper, us, used, user, users, uses, using, utilization, Vvalidated, validation, variety, verispan, very, views, virtually, visual, voluminous, Wwall, waltham, warehouse, warehouses, warehousing, was, web, website, weekends, well, were, whenever, which, who, wide, wireless, with, within, without, woburn, worked, workflow, would, wrote, yahoo!, years";
        //	resRaw = resRaw.toLowerCase();
        //	var resArray = raw_resume.split(", ");
        resVal = resArray.join("~")

        showKW(resVal, " ");
    }

    function initPage() {
        displayRes();
    }

    // this just runs onblur, and sanitizes the list of tabs and commas with spaces
    function kwClean() {
        // replace any commas and tabs with spaces
        var kwVals = document.getElementById("bkw").value;
        kwVals = kwVals.replace(/\,/g, " ");
        kwVals = kwVals.replace(/\~/g, " ");

        // prase out multiple spaces
        while (kwVals.length != kwVals.replace(/  /g, " ").length) { kwVals = kwVals.replace(/  /g, " "); }
        document.getElementById("bkw").value = kwVals;
        displayRes();

    }

    function kwAdd() {
        if (trim(document.getElementById("bkw").value) == "")
        { document.getElementById("bkw").value = trim(document.getElementById("txt_kwSearch").value).toLowerCase(); }
        else { document.getElementById("bkw").value += " " + trim(document.getElementById("txt_kwSearch").value).toLowerCase(); }

        document.getElementById("txt_kwSearch").value = "";
        displayRes();
    }		