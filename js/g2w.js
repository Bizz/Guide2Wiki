var G2W;
(function (G2W) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.getById = function (id) {
            return Utils.getByIdElem(document, id);
        };
        Utils.getByIdElem = function (elem, id) {
            return elem.getElementById(id);
        };
        Utils.getByClass = function (clazz, offset) {
            return Utils.getByClassElem(document, clazz, offset);
        };
        Utils.getByClassElem = function (elem, clazz, offset) {
            var c = elem.getElementsByClassName(clazz);
            return c.length == 1 ? c[0] : (offset != undefined ? c[offset] : c);
        };
        Utils.getByTag = function (tag, offset) {
            return Utils.getByTagElem(document, tag, offset);
        };
        Utils.getByTagElem = function (elem, tag, offset) {
            var t = elem.getElementsByTagName(tag);
            return t.length == 1 ? t[0] : (offset != undefined ? t[offset] : t);
        };
        Utils.attachEvent = function (elem, event, func) {
            elem.attributes[event].value = func;
        };
        Utils.toDom = function (str) {
            return new DOMParser().parseFromString(str, "text/html");
        };
        Utils.getAttr = function (elem, attr) {
            var attrs = elem.attributes;
            if (attrs[attr] == undefined)
                return undefined;
            return attrs[attr].value;
        };
        Utils.substr = function (target, start, end) {
            if (end != undefined)
                return target.substring(target.indexOf(start) + start.length, end);
            return target.substring(target.indexOf(start) + start.length);
        };
        Utils.substring = function (target, start, end) {
            return target.substring(target.indexOf(start) + start.length, target.indexOf(end));
        };
        Utils.substringLast = function (target, start, end) {
            return target.substring(target.lastIndexOf(start) + start.length, target.indexOf(end));
        };
        Utils.getBox = function (dom, header) {
            var offset = this.hasHeader(dom, header), next = this.findNextHeader(dom, offset);
            if (offset > -1)
                return this.fetchBox(dom, offset + 1, next - 1);
            return undefined;
        };
        Utils.hasHeader = function (dom, header) {
            var rows = G2W.Utils.getByTagElem(dom, "table", 5).childNodes[1].childNodes;
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.childNodes.length > 0) {
                    if (G2W.Utils.getAttr(row.firstChild, "class") == "tHeader") {
                        if (row.firstChild.innerText == header) {
                            return i;
                        }
                    }
                }
            }
            return -1;
        };
        Utils.findNextHeader = function (dom, start) {
            var rows = G2W.Utils.getByTagElem(dom, "table", 5).childNodes[1].childNodes;
            for (var i = start + 1; i < rows.length; i++) {
                var row = rows[i];
                if (row.childNodes.length > 0) {
                    if (G2W.Utils.getAttr(row.firstChild, "class") == "tHeader") {
                        return i;
                    }
                }
            }
            return rows.length - 1;
        };
        Utils.fetchBox = function (dom, start, end) {
            var elements = [];
            var rows = G2W.Utils.getByTagElem(dom, "table", 5).childNodes[1].childNodes;
            for (var i = start; i < end; i++) {
                elements.push(rows[i]);
            }
            return elements;
        };
        Utils.showAlertBox = function (type) {
            var box = this.getById("alertbox"), message = "Generation success.", title = "Success!", clazz = "success";
            if (type == "danger") {
                message = "Error occured while generating wiki code. Please open Your JavaScript console and report error to creator.";
                title = "Oh snap!";
                clazz = "danger";
            }
            box.classList.remove("hidden");
            box.classList.remove("alert-danger");
            box.classList.remove("alert-success");
            box.classList.add("alert-" + clazz);
            box.innerHTML = "<strong>" + title + "</strong> " + message;
        };
        Utils.closeAlertBox = function () {
            var box = this.getById("alertbox").classList.add("hidden");
        };
        return Utils;
    }());
    G2W.Utils = Utils;
    var CustomDialogs;
    (function (CustomDialogs) {
        var queueObject = undefined;
        var current = undefined;
        function getQueue() {
            if (queueObject == undefined) {
                queueObject = new CustomDialogQueue();
            }
            return queueObject;
        }
        CustomDialogs.getQueue = getQueue;
        function getCurrent() {
            return current;
        }
        CustomDialogs.getCurrent = getCurrent;
        function next() {
            current = queueObject.queue.shift();
            return current;
        }
        CustomDialogs.next = next;
        var CustomDialogQueue = (function () {
            function CustomDialogQueue() {
                this.queue = [];
            }
            CustomDialogQueue.prototype.add = function (dialog) {
                this.queue.push(dialog);
            };
            return CustomDialogQueue;
        }());
        CustomDialogs.CustomDialogQueue = CustomDialogQueue;
        var CustomDialogType;
        (function (CustomDialogType) {
            CustomDialogType[CustomDialogType["Relic"] = 1] = "Relic";
            CustomDialogType[CustomDialogType["Shop"] = 2] = "Shop";
            CustomDialogType[CustomDialogType["Quest"] = 3] = "Quest";
            CustomDialogType[CustomDialogType["Portal"] = 4] = "Portal";
        })(CustomDialogType = CustomDialogs.CustomDialogType || (CustomDialogs.CustomDialogType = {}));
        var CustomInputDialog = (function () {
            function CustomInputDialog(type, target, x, y) {
                this.type = type;
                this.target = target;
                this.x = x;
                this.y = y;
            }
            CustomInputDialog.prototype.open = function () {
                var modal = G2W.Utils.getById("customModal"), modalMessage = G2W.Utils.getById("cm-message"), modalData = G2W.Utils.getById("cm-data"), modalMap = G2W.Utils.getById("cm-map"), inputObj = document.createElement("input");
                modalMessage.innerHTML = "There is <b>" + CustomDialogType[this.type] + "</b> on (" + this.x + "," + this.y + ").<br />Please select which one is:";
                inputObj.id = "cDialogInput";
                modalData.innerHTML = "";
                modalData.appendChild(inputObj);
                var map = G2W.Data.getData().map, calcWidth = map.width * 27 + 62;
                if (calcWidth < 580)
                    calcWidth = 580;
                modalMap.innerHTML = map.generateMap();
                $(".modal-dialog").animate({ width: calcWidth + "px" }, 400);
                var location = G2W.Utils.getById("m" + this.x + "_" + this.y);
                location.classList.add("selected");
                $('#customModal').modal('show');
            };
            CustomInputDialog.prototype.close = function () {
                var inputed = G2W.Utils.getById("cDialogInput").value;
                this.target.name = inputed;
                this.target.x = this.x;
                this.target.y = this.y;
                G2W.nextDialog();
            };
            return CustomInputDialog;
        }());
        CustomDialogs.CustomInputDialog = CustomInputDialog;
        var CustomSelectDialog = (function () {
            function CustomSelectDialog(type, list, x, y) {
                this.type = type;
                this.list = list;
                this.x = x;
                this.y = y;
                this.select = [];
            }
            CustomSelectDialog.prototype.open = function () {
                var modal = G2W.Utils.getById("customModal"), modalMessage = G2W.Utils.getById("cm-message"), modalData = G2W.Utils.getById("cm-data"), modalMap = G2W.Utils.getById("cm-map"), selectObj = document.createElement("select");
                if (this.type != CustomDialogType.Quest) {
                    modalMessage.innerHTML = "There is <b>" + CustomDialogType[this.type] + "</b> on (" + this.x + "," + this.y + ").<br />Please select which one is:";
                }
                else {
                    modalMessage.innerHTML = "There is maybe <b>" + CustomDialogType[this.type] + "</b> on (" + this.x + "," + this.y + ").<br />Please select which one is:";
                }
                selectObj.id = "cDialogSelect";
                modalData.innerHTML = "";
                modalData.appendChild(selectObj);
                for (var i = 0; i < this.list.length; i++) {
                    var option = document.createElement("option");
                    option.value = i.toString();
                    option.text = this.list[i].name;
                    selectObj.appendChild(option);
                }
                var map = G2W.Data.getData().map, calcWidth = map.width * 27 + 62;
                if (calcWidth < 580)
                    calcWidth = 580;
                modalMap.innerHTML = map.generateMap();
                $(".modal-dialog").animate({ width: calcWidth + "px" }, 400);
                var location = G2W.Utils.getById("m" + this.x + "_" + this.y);
                location.classList.add("selected");
                $('#customModal').modal('show');
            };
            CustomSelectDialog.prototype.close = function () {
                var selected = parseInt(G2W.Utils.getById("cDialogSelect").value), obj = this.list[selected];
                obj.x = this.x;
                obj.y = this.y;
                G2W.nextDialog();
            };
            return CustomSelectDialog;
        }());
        CustomDialogs.CustomSelectDialog = CustomSelectDialog;
    })(CustomDialogs = G2W.CustomDialogs || (G2W.CustomDialogs = {}));
})(G2W || (G2W = {}));
var G2W;
(function (G2W) {
    var Converter = (function () {
        function Converter() {
        }
        Converter.getConverter = function () {
            return new Converter();
        };
        Converter.prototype.start = function (source) {
            var dom = G2W.Utils.toDom(source);
            this.extractBasic(dom);
            this.extractCreatures(dom);
            this.extractQuests(dom);
            this.extractShops(dom);
            this.extractRelics(dom);
            this.extractMap(dom);
            return G2W.Data.getData();
        };
        Converter.prototype.extractBasic = function (dom) {
            var data = G2W.Data.getData(), basic = data.basic, header = G2W.Utils.getByClassElem(dom, "tHeader", 0).firstChild.innerText, level = G2W.Utils.substr(header, "(Min Level: ", header.length - 1);
            basic.level = level;
        };
        Converter.prototype.extractCreatures = function (dom) {
            var data = G2W.Data.getData(), creatureElems = G2W.Utils.getBox(dom, "Creatures:");
            for (var i in creatureElems) {
                var e = creatureElems[i], cName = e.innerText, creature = new G2W.Data.Creature();
                if (cName == undefined || cName.length == 0)
                    continue;
                creature.parse(cName);
                data.addCreature(creature);
            }
        };
        Converter.prototype.extractQuests = function (dom) {
            var data = G2W.Data.getData(), questElems = G2W.Utils.getBox(dom, "Quests:");
            var dummyQuest = new G2W.Data.Quest();
            dummyQuest.id = -1;
            dummyQuest.name = "Not a quest";
            data.addQuest(dummyQuest);
            for (var i in questElems) {
                var e = questElems[i], qName = e.innerText, quest = new G2W.Data.Quest();
                if (qName == undefined || qName.length == 0)
                    continue;
                quest.id = i;
                quest.name = qName;
                data.addQuest(quest);
            }
        };
        Converter.prototype.extractShops = function (dom) {
            var data = G2W.Data.getData(), shopElems = G2W.Utils.getBox(dom, "Shops:");
            for (var i in shopElems) {
                var e = shopElems[i], sName = e.innerText, shop = new G2W.Data.Shop();
                if (sName == undefined || sName.length == 0)
                    continue;
                shop.name = sName;
                data.addShop(shop);
            }
        };
        Converter.prototype.extractRelics = function (dom) {
            var data = G2W.Data.getData(), relicElems = G2W.Utils.getBox(dom, "Relics:");
            for (var i in relicElems) {
                var e = relicElems[i], rName = e.innerText, relic = new G2W.Data.Relic();
                if (rName == undefined || rName.length == 0)
                    continue;
                relic.name = rName;
                data.addRelic(relic);
            }
        };
        Converter.prototype.extractMap = function (dom) {
            var data = G2W.Data.getData(), map = data.map, container = G2W.Utils.getByClassElem(dom, "realmContainer"), table = G2W.Utils.getByTagElem(container, "table"), imgs = G2W.Utils.getByTagElem(container, "img"), height = G2W.Utils.getByTagElem(table, "tr").length, width = G2W.Utils.getByTagElem(table, "td").length / height;
            map.width = width;
            map.height = height;
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var imgOffset = (width * y) + x, img = imgs[imgOffset], imgUrl = G2W.Utils.getAttr(img, "src"), tile = G2W.Utils.substringLast(imgUrl, "/", ".gif"), tileSet = undefined, tileNum = undefined;
                    if (imgUrl.indexOf("/tiles/") == -1) {
                        var mouseOver = G2W.Utils.getAttr(img, "onmouseover"), end = 0;
                        if (mouseOver != undefined) {
                            end = mouseOver.indexOf("');");
                        }
                        if (imgUrl.indexOf("stairways") > -1) {
                            tileNum = "a" + tile;
                            var isMaster = mouseOver.indexOf("Master Realm") > -1, stair = new G2W.Data.Stair(isMaster), stairName = undefined;
                            if (isMaster) {
                                stairName = G2W.Utils.substr(mouseOver, "Stairway to Master Realm \\'", end);
                                stairName = stairName.substring(0, stairName.length - 2);
                            }
                            else {
                                stairName = G2W.Utils.substr(mouseOver, "Stairway to ", end);
                            }
                            stair.name = stairName;
                            stair.x = x;
                            stair.y = y;
                            data.addStair(stair);
                        }
                        else if (imgUrl.indexOf("relics") > -1) {
                            tileNum = "r" + tile;
                            var relics = data.relics, relic = undefined, queue = G2W.CustomDialogs.getQueue();
                            if (relics.length == 1) {
                                relic = relics[0];
                                relic.x = x;
                                relic.y = y;
                            }
                            else {
                                var cDialog = new G2W.CustomDialogs.CustomSelectDialog(G2W.CustomDialogs.CustomDialogType.Relic, relics, x, y);
                                queue.add(cDialog);
                            }
                        }
                        else if (imgUrl.indexOf("shops") > -1) {
                            tileNum = "s" + tile;
                            var shop = data.getShopByName(G2W.Utils.substr(mouseOver, "Shop: ", end));
                            shop.x = x;
                            shop.y = y;
                        }
                        else if (imgUrl.indexOf("portals") > -1) {
                            tileNum = "p" + tile;
                            var portal = new G2W.Data.Portal(), queue = G2W.CustomDialogs.getQueue();
                            portal.x = x;
                            portal.y = y;
                            data.addPortal(portal);
                            var dDialog = new G2W.CustomDialogs.CustomInputDialog(G2W.CustomDialogs.CustomDialogType.Portal, portal, x, y);
                            queue.add(dDialog);
                        }
                        else if (imgUrl.indexOf("locations") > -1) {
                            tileNum = "l" + tile;
                            var quests = data.quests, queue = G2W.CustomDialogs.getQueue();
                            var cDialog = new G2W.CustomDialogs.CustomSelectDialog(G2W.CustomDialogs.CustomDialogType.Quest, quests, x, y);
                            queue.add(cDialog);
                        }
                    }
                    else {
                        tileSet = tile.substring(0, tile.indexOf("_"));
                        tileNum = "t" + G2W.Utils.substr(tile, "_");
                    }
                    map.tileSet = tileSet;
                    if (map.layout[y] == undefined)
                        map.layout[y] = [];
                    map.layout[y][x] = tileNum;
                }
            }
        };
        return Converter;
    }());
    G2W.Converter = Converter;
})(G2W || (G2W = {}));
var G2W;
(function (G2W) {
    var Exporter = (function () {
        function Exporter() {
            this.STAIR_TEMPLATE = '* [[%name%]] (%x%,%y%)';
            this.QUEST_TEMPLATE = '* [[%name%]] (%x%,%y%)';
            this.RELIC_TEMPLATE = '* <nowiki>[relic]</nowiki> [[%name%]] (%x%,%y%)';
            this.PORTAL_TEMPLATE = '* <nowiki>[portal]</nowiki> [[%name%]] (%x%,%y%)';
            this.SHOP_TEMPLATE = '* <nowiki>[shop]</nowiki> [[%name%]] (%x%,%y%)';
            this.CREATURE_TEMPLATE = '* [[%name%]] %type%';
            this.INFORMATION_HEADER = '== Information ==';
            this.SHOPS_STAIRS_HEADER = '== Shops and Stairs ==';
            this.QUESTS_HEADER = '== Quests ==';
            this.CREATURES_HEADER = '== Creatures ==';
            this.MAP_HEADER = '== Map ==';
            this.SPACER = '|width="50%" valign="top" align="left"|';
            this.NONE = '* {{none}}';
            this.MAP_NOTE = '{{MapNote|image=%url%|target=%target%|type=%type%}}';
            this.TILE_URL = G2W.Constants.CDN_HOSTNAME + "/tiles/%set%_%tile%.gif";
            this.LOCATION_URL = G2W.Constants.CDN_HOSTNAME + "/locations/%tile%.gif";
            this.STAIR_URL = G2W.Constants.CDN_HOSTNAME + "/stairways/%tile%.gif";
            this.RELIC_URL = G2W.Constants.CDN_HOSTNAME + "/relics/%tile%.gif";
            this.PORTAL_URL = G2W.Constants.CDN_HOSTNAME + "/portals/%tile%.gif";
            this.SHOP_URL = G2W.Constants.CDN_HOSTNAME + "/shops/%tile%.gif";
        }
        Exporter.getExporter = function () {
            return new Exporter();
        };
        Exporter.prototype.start = function (source) {
            var wiki = "";
            wiki = this.generateHeader(wiki, source);
            wiki = this.generateInformation(wiki, source.basic);
            wiki = this.generateShopsStairs(wiki, source);
            wiki = this.generateQuests(wiki, source.quests);
            wiki = this.generateCreatures(wiki, source.creatures);
            wiki = this.generateMap(wiki, source);
            wiki = this.generateFooter(wiki, source);
            return wiki;
        };
        Exporter.prototype.generateHeader = function (wiki, source) {
            wiki = append(wiki, '__NOTOC__');
            wiki = append(wiki, '{|cellpadding="5" width="100%"');
            wiki = append(wiki, this.SPACER);
            return wiki;
        };
        Exporter.prototype.generateInformation = function (wiki, source) {
            wiki = append(wiki, this.INFORMATION_HEADER);
            wiki = append(wiki, '* Min Level: ' + source.level);
            return wiki;
        };
        Exporter.prototype.generateShopsStairs = function (wiki, source) {
            wiki = append(wiki, this.SHOPS_STAIRS_HEADER);
            for (var i in source.stairs) {
                var a = source.stairs[i];
                wiki = appendReplaced(wiki, this.STAIR_TEMPLATE, ["%name%", a.name, "%x%", a.x, "%y%", a.y]);
            }
            for (var i in source.relics) {
                var r = source.relics[i];
                wiki = appendReplaced(wiki, this.RELIC_TEMPLATE, ["%name%", r.name, "%x%", r.x, "%y%", r.y]);
            }
            for (var i in source.portals) {
                var p = source.portals[i];
                wiki = appendReplaced(wiki, this.PORTAL_TEMPLATE, ["%name%", p.name, "%x%", p.x, "%y%", p.y]);
            }
            for (var i in source.shops) {
                var s = source.shops[i];
                wiki = appendReplaced(wiki, this.SHOP_TEMPLATE, ["%name%", s.name, "%x%", s.x, "%y%", s.y]);
            }
            wiki = append(wiki, this.SPACER);
            return wiki;
        };
        Exporter.prototype.generateQuests = function (wiki, quests) {
            wiki = append(wiki, this.QUESTS_HEADER);
            quests.shift();
            if (quests.length == 0) {
                wiki = append(wiki, this.NONE);
            }
            else {
                for (var i in quests) {
                    var q = quests[i];
                    wiki = appendReplaced(wiki, this.QUEST_TEMPLATE, ["%name%", q.name, "%x%", q.x, "%y%", q.y]);
                }
            }
            return wiki;
        };
        Exporter.prototype.generateCreatures = function (wiki, creatures) {
            wiki = append(wiki, this.CREATURES_HEADER);
            if (creatures.length == 0) {
                wiki = append(wiki, this.NONE);
            }
            else {
                for (var i in creatures) {
                    var c = creatures[i];
                    wiki = appendReplaced(wiki, this.CREATURE_TEMPLATE, ["%name%", c.name, "%type%", c.type]);
                }
            }
            wiki = append(wiki, '|}');
            return wiki;
        };
        Exporter.prototype.generateMap = function (wiki, data) {
            var map = data.map;
            wiki = append(wiki, this.MAP_HEADER);
            wiki = append(wiki, '{{Map}}');
            wiki = append(wiki, '');
            wiki = append(wiki, '<center>');
            wiki = append(wiki, '{| cellspacing="1" cellpadding="0" style="text-align:center"');
            wiki = append(wiki, '|&nbsp;');
            for (var i = 0; i < map.width; i++) {
                wiki = append(wiki, '|' + i);
            }
            wiki = append(wiki, '|&nbsp;');
            for (var y = 0; y < map.height; y++) {
                wiki = append(wiki, '|-');
                wiki = append(wiki, '|' + y);
                for (var x = 0; x < map.width; x++) {
                    var imgRec = map.layout[y][x], imgType = imgRec.substring(0, 1), img = imgRec.substring(1), imgUrl = undefined;
                    switch (imgType) {
                        case "a":
                            imgUrl = this.STAIR_URL;
                            var stair = data.getStairAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%", imgUrl, "%target%", stair.name, "%type%", stair.type]);
                            break;
                        case "r":
                            imgUrl = this.RELIC_URL;
                            var relic = data.getRelicAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%", imgUrl, "%target%", relic.name, "%type%", relic.type]);
                            break;
                        case "s":
                            imgUrl = this.SHOP_URL;
                            var shop = data.getShopAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%", imgUrl, "%target%", shop.name, "%type%", shop.type]);
                            break;
                        case "p":
                            imgUrl = this.PORTAL_URL;
                            var portal = data.getPortalAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%", imgUrl, "%target%", portal.name, "%type%", portal.type]);
                            break;
                        case "l":
                            imgUrl = this.LOCATION_URL;
                            var quest = data.getQuestAt(x, y);
                            if (quest != undefined) {
                                imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%", imgUrl, "%target%", quest.name, "%type%", "Q"]);
                            }
                            break;
                        default:
                            imgUrl = this.TILE_URL;
                            imgUrl = imgUrl.replace("%set%", map.tileSet);
                            break;
                    }
                    wiki = appendReplaced(wiki, '|' + imgUrl, ["%tile%", img]);
                }
                wiki = append(wiki, '|' + y);
            }
            wiki = append(wiki, '|-');
            wiki = append(wiki, '|&nbsp;');
            for (var i = 0; i < map.width; i++) {
                wiki = append(wiki, '|' + i);
            }
            wiki = append(wiki, '|&nbsp;');
            wiki = append(wiki, '</center>');
            return wiki;
        };
        Exporter.prototype.generateFooter = function (wiki, source) {
            return append(wiki, '[[Category:Areas]]');
        };
        return Exporter;
    }());
    G2W.Exporter = Exporter;
})(G2W || (G2W = {}));
var G2W;
(function (G2W) {
    var Data;
    (function (Data) {
        var data = (function () {
            function data() {
                this.basic = new Basic();
                this.creatures = [];
                this.quests = [];
                this.stairs = [];
                this.relics = [];
                this.shops = [];
                this.portals = [];
                this.map = new MapLayout();
            }
            data.prototype.addCreature = function (creature) {
                this.creatures.push(creature);
            };
            data.prototype.addQuest = function (quest) {
                this.quests.push(quest);
            };
            data.prototype.getQuestAt = function (x, y) {
                for (var i in this.quests) {
                    var q = this.quests[i];
                    if (q.x == x && q.y == y) {
                        return q;
                    }
                }
                return undefined;
            };
            data.prototype.addStair = function (stair) {
                this.stairs.push(stair);
            };
            data.prototype.getStairAt = function (x, y) {
                for (var i in this.stairs) {
                    var a = this.stairs[i];
                    if (a.x == x && a.y == y) {
                        return a;
                    }
                }
                return undefined;
            };
            data.prototype.addRelic = function (relic) {
                this.relics.push(relic);
            };
            data.prototype.getRelicAt = function (x, y) {
                for (var i in this.relics) {
                    var r = this.relics[i];
                    if (r.x == x && r.y == y) {
                        return r;
                    }
                }
                return undefined;
            };
            data.prototype.addShop = function (shop) {
                this.shops.push(shop);
            };
            data.prototype.getShopAt = function (x, y) {
                for (var i in this.shops) {
                    var s = this.shops[i];
                    if (s.x == x && s.y == y) {
                        return s;
                    }
                }
                return undefined;
            };
            data.prototype.getShopByName = function (name) {
                for (var i in this.shops) {
                    var s = this.shops[i];
                    if (s.name == name) {
                        return s;
                    }
                }
                return undefined;
            };
            data.prototype.addPortal = function (portal) {
                this.portals.push(portal);
            };
            data.prototype.getPortalAt = function (x, y) {
                for (var i in this.portals) {
                    var p = this.portals[i];
                    if (p.x == x && p.y == y) {
                        return p;
                    }
                }
                return undefined;
            };
            data.prototype.toJson = function () {
                return JSON.stringify(this);
            };
            return data;
        }());
        Data.data = data;
        var MapLocationType;
        (function (MapLocationType) {
            MapLocationType[MapLocationType["S"] = 1] = "S";
            MapLocationType[MapLocationType["A"] = 2] = "A";
            MapLocationType[MapLocationType["WA"] = 3] = "WA";
            MapLocationType[MapLocationType["P"] = 4] = "P";
            MapLocationType[MapLocationType["R"] = 5] = "R";
        })(MapLocationType = Data.MapLocationType || (Data.MapLocationType = {}));
        var Basic = (function () {
            function Basic() {
                this.locations = [];
            }
            Basic.prototype.addLocation = function (location) {
                this.locations.push(location);
            };
            return Basic;
        }());
        Data.Basic = Basic;
        var Creature = (function () {
            function Creature() {
            }
            Creature.prototype.parse = function (fullName) {
                this.type = fullName.substring(fullName.lastIndexOf("("));
                this.name = fullName.substring(0, fullName.lastIndexOf("(") - 1);
            };
            return Creature;
        }());
        Data.Creature = Creature;
        var Quest = (function () {
            function Quest() {
            }
            return Quest;
        }());
        Data.Quest = Quest;
        var Relic = (function () {
            function Relic() {
                this.type = MapLocationType[MapLocationType.R];
            }
            return Relic;
        }());
        Data.Relic = Relic;
        var Stair = (function () {
            function Stair(isMaster) {
                if (isMaster) {
                    this.type = MapLocationType[MapLocationType.WA];
                }
                else {
                    this.type = MapLocationType[MapLocationType.A];
                }
            }
            return Stair;
        }());
        Data.Stair = Stair;
        var Shop = (function () {
            function Shop() {
                this.type = MapLocationType[MapLocationType.S];
            }
            return Shop;
        }());
        Data.Shop = Shop;
        var Portal = (function () {
            function Portal() {
                this.type = MapLocationType[MapLocationType.P];
            }
            return Portal;
        }());
        Data.Portal = Portal;
        var MapLayout = (function () {
            function MapLayout() {
                this.layout = [];
            }
            MapLayout.prototype.generateMap = function () {
                if (this.generatedMap == undefined) {
                    var table = document.createElement("table"), tileUrl = G2W.Constants.CDN_HOSTNAME + "/tiles/%set%_%tile%.gif", locationUrl = G2W.Constants.CDN_HOSTNAME + "/locations/%tile%.gif", stairUrl = G2W.Constants.CDN_HOSTNAME + "/stairways/%tile%.gif", relicUrl = G2W.Constants.CDN_HOSTNAME + "/relics/%tile%.gif", portalUrl = G2W.Constants.CDN_HOSTNAME + "/portals/%tile%.gif", shopsUrl = G2W.Constants.CDN_HOSTNAME + "/shops/%tile%.gif";
                    table.border = "2";
                    table.cellSpacing = "0";
                    table.cellPadding = "0";
                    table.classList.add("map");
                    table.style.margin = "0 auto";
                    for (var y = 0; y < this.layout.length; y++) {
                        var tr = document.createElement("tr");
                        for (var x = 0; x < this.layout[y].length; x++) {
                            var td = document.createElement("td"), img = document.createElement("img"), tileRecord = this.layout[y][x], tileType = tileRecord.substring(0, 1), tile = tileRecord.substring(1), imgUrl = undefined;
                            switch (tileType) {
                                case "a":
                                    imgUrl = stairUrl;
                                    break;
                                case "r":
                                    imgUrl = relicUrl;
                                    break;
                                case "s":
                                    imgUrl = shopsUrl;
                                    break;
                                case "p":
                                    imgUrl = portalUrl;
                                    break;
                                case "l":
                                    imgUrl = locationUrl;
                                    break;
                                default:
                                    imgUrl = tileUrl;
                                    imgUrl = imgUrl.replace("%set%", this.tileSet);
                                    break;
                            }
                            img.width = 25;
                            img.height = 25;
                            img.align = "center";
                            img.src = imgUrl.replace("%tile%", tile);
                            td.id = "m" + x + "_" + y;
                            td.appendChild(img);
                            tr.appendChild(td);
                        }
                        table.appendChild(tr);
                    }
                    this.generatedMap = new XMLSerializer().serializeToString(table);
                }
                return this.generatedMap;
            };
            return MapLayout;
        }());
        Data.MapLayout = MapLayout;
        var dataObject = undefined;
        function getData() {
            if (dataObject == undefined) {
                dataObject = new data();
            }
            return dataObject;
        }
        Data.getData = getData;
        function resetData() {
            dataObject = new data();
            G2W.Utils.getById("cm-map").innerHTML = "";
        }
        Data.resetData = resetData;
    })(Data = G2W.Data || (G2W.Data = {}));
})(G2W || (G2W = {}));
var G2W;
(function (G2W) {
    function start() {
        try {
            G2W.Data.resetData();
            G2W.Utils.closeAlertBox();
            G2W.Utils.getById("result").value = "";
            var source = G2W.Utils.getById("source"), data = G2W.Converter.getConverter().start(source.value);
            G2W.nextDialog();
        }
        catch (e) {
            console.log("ERROR: " + e.message);
            G2W.Utils.showAlertBox("danger");
        }
    }
    G2W.start = start;
    function nextDialog() {
        try {
            var totalDialogs = G2W.CustomDialogs.getQueue().queue.length;
            if (totalDialogs > 0) {
                var action = G2W.Utils.getById("cm-action");
                if (totalDialogs == 1) {
                    action.innerText = "Finish";
                }
                else {
                    action.innerText = "Next >";
                }
                G2W.CustomDialogs.next().open();
            }
            else {
                $('#customModal').modal('hide');
                G2W.finish();
            }
        }
        catch (e) {
            console.log("ERROR: " + e.message);
            G2W.Utils.showAlertBox("danger");
        }
    }
    G2W.nextDialog = nextDialog;
    function finish() {
        try {
            var result = G2W.Utils.getById("result"), wiki = G2W.Exporter.getExporter().start(G2W.Data.getData());
            result.value = wiki;
            G2W.Utils.showAlertBox();
            G2W.Utils.getById("source").value = "";
        }
        catch (e) {
            console.log("ERROR: " + e.message);
            G2W.Utils.showAlertBox("danger");
        }
    }
    G2W.finish = finish;
})(G2W || (G2W = {}));
function append(source, target) {
    return source += target + "\n";
}
function appendReplaced(source, replace, keyVal) {
    for (var i = 0; i < keyVal.length; i += 2) {
        replace = replace.replace(keyVal[i], keyVal[i + 1].toString());
    }
    return append(source, replace);
}
var G2W;
(function (G2W) {
    var Constants = (function () {
        function Constants() {
        }
        Constants.CDN_HOSTNAME = 'http://cdn.fallensword.com';
        return Constants;
    }());
    G2W.Constants = Constants;
})(G2W || (G2W = {}));
