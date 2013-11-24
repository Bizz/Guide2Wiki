module G2W {
    /*
     * Class for convertion from Officle Guide source code to {@link G2W.Data.data} object.
     * 
     * @author bizzpu17
     */
    export class Converter {
        /*
         * Factory method.
         */
        static getConverter() {
            return new Converter();
        }

        /*
         * Start conversion from source code to {@link G2W.Data.data} object.
         *  
         * @param {@link String} source code
         */
        start(source: string) {
            var dom = G2W.Utils.toDom(source);

            this.extractBasic(dom);
            this.extractCreatures(dom);
            this.extractQuests(dom);
            this.extractShops(dom);
            this.extractRelics(dom);
            this.extractMap(dom);

            return G2W.Data.getData();
        }

        /*
         * Extract basic informations from Official Guide area source code.
         * 
         * @param source {@link string} Official Guide area source code
         */
        extractBasic(dom: HTMLDocument) {
            var data = G2W.Data.getData(),
                basic = data.basic,
                header = G2W.Utils.getByClassElem(dom, "tHeader", 0).firstChild.innerText,
                level = G2W.Utils.substr(header, "(Min Level: ", header.length - 1);

            basic.level = level;
        }

        /*
         * Extract creatures informations from Official Guide area source code.
         * 
         * @param source {@link string} Official Guide area source code
         */
        extractCreatures(dom: HTMLDocument) {
            var data = G2W.Data.getData(),
                creatureElems = G2W.Utils.getBox(dom, "Creatures:");

            for (var i in creatureElems) {
                var e = creatureElems[i],
                    cName = e.innerText,
                    creature = new G2W.Data.Creature();

                if (cName == undefined || cName.length == 0)
                    continue;

                creature.parse(cName);
                data.addCreature(creature);
            }
        }

        /*
         * Extract quests informations from Official Guide area source code.
         * 
         * @param source {@link string} Official Guide area source code
         */
        extractQuests(dom: HTMLDocument) {
            var data = G2W.Data.getData(),
                questElems = G2W.Utils.getBox(dom, "Quests:");

            // Dummy quest for special artwork on map
            var dummyQuest = new G2W.Data.Quest();
            dummyQuest.id = -1;
            dummyQuest.name = "Not a quest";
            data.addQuest(dummyQuest);

            for (var i in questElems) {
                var e = questElems[i],
                    qName = e.innerText,
                    quest = new G2W.Data.Quest();

                if (qName == undefined || qName.length == 0)
                    continue;

                quest.id = i;
                quest.name = qName;
                data.addQuest(quest);
            }
        }

        /*
         * Extract shops informations from Official Guide area source code.
         * 
         * @param source {@link string} Official Guide area source code
         */
        extractShops(dom: HTMLDocument) {
            var data = G2W.Data.getData(),
                shopElems = G2W.Utils.getBox(dom, "Shops:");

            for (var i in shopElems) {
                var e = shopElems[i],
                    sName = e.innerText,
                    shop = new G2W.Data.Shop();

                if (sName == undefined || sName.length == 0)
                    continue;

                shop.name = sName;
                data.addShop(shop);
            }
        }

        /*
         * Extract relic informations from Official Guide area source code.
         * 
         * @param source {@link string} Official Guide area source code
         */
        extractRelics(dom: HTMLDocument) {
            var data = G2W.Data.getData(),
                relicElems = G2W.Utils.getBox(dom, "Relics:");

            for (var i in relicElems) {
                var e = relicElems[i],
                    rName = e.innerText,
                    relic = new G2W.Data.Relic();

                if (rName == undefined || rName.length == 0)
                    continue;

                relic.name = rName;
                data.addRelic(relic);
            }
        }

        /*
         * Extract map information from Official Guide area source code.
         * 
         * @param source {@link string} Official Guide area source code
         */
        extractMap(dom: HTMLDocument) {
            var data = G2W.Data.getData(),
                map = data.map,
                container = G2W.Utils.getByClassElem(dom, "realmContainer"),
                table = G2W.Utils.getByTagElem(container, "table"),
                imgs = G2W.Utils.getByTagElem(container, "img"),
                height = G2W.Utils.getByTagElem(table, "tr").length,
                width = G2W.Utils.getByTagElem(table, "td").length / height;

            map.width = width;
            map.height = height;

            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var imgOffset = (width * y) + x,
                        img = imgs[imgOffset],
                        imgUrl = G2W.Utils.getAttr(img, "src"),
                        tile = G2W.Utils.substringLast(imgUrl, "/", ".gif"),
                        tileSet = undefined,
                        tileNum = undefined;

                    if (imgUrl.indexOf("/tiles/") == -1) {
                        var mouseOver = G2W.Utils.getAttr(img, "onmouseover"),
                            end = 0;

                        // Quest location dont have mouseover..
                        if (mouseOver != undefined) {
                            end = mouseOver.indexOf("');");
                        }

                        if (imgUrl.indexOf("stairways") > -1) {
                            tileNum = "a" + tile;

                            var isMaster = mouseOver.indexOf("Master Realm") > -1,
                                stair = new G2W.Data.Stair(isMaster),
                                stairName = undefined;

                            if (isMaster) {
                                stairName = G2W.Utils.substr(mouseOver, "Stairway to Master Realm \\'", end);
                                stairName = stairName.substring(0, stairName.length - 2);
                            } else {
                                stairName = G2W.Utils.substr(mouseOver, "Stairway to ", end);
                            }

                            stair.name = stairName;
                            stair.x = x;
                            stair.y = y;

                            data.addStair(stair);

                        } else if (imgUrl.indexOf("relics") > -1) {
                            tileNum = "r" + tile;

                            var relics = data.relics,
                                relic = undefined,
                                queue = G2W.CustomDialogs.getQueue();

                            if (relics.length == 1) {
                                relic = relics[0];
                                relic.x = x;
                                relic.y = y;
                            } else {
                                var cDialog = new G2W.CustomDialogs.CustomSelectDialog(G2W.CustomDialogs.CustomDialogType.Relic, relics, x, y);

                                queue.add(cDialog);
                            }

                        } else if (imgUrl.indexOf("shops") > -1) {
                            tileNum = "s" + tile;

                            var shop = data.getShopByName(G2W.Utils.substr(mouseOver, "Shop: ", end));
                            shop.x = x;
                            shop.y = y;

                        } else if (imgUrl.indexOf("portals") > -1) {
                            tileNum = "p" + tile;

                            var portal = new G2W.Data.Portal(),
                                queue = G2W.CustomDialogs.getQueue();

                            portal.x = x;
                            portal.y = y;

                            data.addPortal(portal);

                            // Portals arent listed in sidebar
                            var dDialog = new G2W.CustomDialogs.CustomInputDialog(G2W.CustomDialogs.CustomDialogType.Portal, portal, x, y);

                            queue.add(dDialog);

                        } else if (imgUrl.indexOf("locations") > -1) {
                            tileNum = "l" + tile;

                            var quests = data.quests,
                                queue = G2W.CustomDialogs.getQueue();

                            // Quests dont have auto-detection as quest locations have same url as custom artwork on map.
                            var cDialog = new G2W.CustomDialogs.CustomSelectDialog(G2W.CustomDialogs.CustomDialogType.Quest, quests, x, y);

                            queue.add(cDialog);
                        }
                    } else {
                        tileSet = tile.substring(0, tile.indexOf("_"));
                        tileNum = "t" + G2W.Utils.substr(tile, "_");
                    }

                    map.tileSet = tileSet;
                    if (map.layout[y] == undefined)
                        map.layout[y] = [];
                    map.layout[y][x] = tileNum;

                }
            }
        }

    }
}
