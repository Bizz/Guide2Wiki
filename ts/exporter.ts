module G2W {
    /*
     * Class for exporting {@link G2W.Data.data} to Wiki code.
     * 
     * @author bizzpu17
     */
    export class Exporter {
        /*
         * Factory method.
         */
        static getExporter() {
            return new Exporter();
        }

        private STAIR_TEMPLATE: string = '* [[%name%]] (%x%,%y%)';
        private QUEST_TEMPLATE: string = '* [[%name%]] (%x%,%y%)';
        private RELIC_TEMPLATE: string = '* <nowiki>[relic]</nowiki> [[%name%]] (%x%,%y%)';
        private PORTAL_TEMPLATE: string = '* <nowiki>[portal]</nowiki> [[%name%]] (%x%,%y%)';
        private SHOP_TEMPLATE: string = '* <nowiki>[shop]</nowiki> [[%name%]] (%x%,%y%)';
        private CREATURE_TEMPLATE: string = '* [[%name%]] %type%';

        private INFORMATION_HEADER: string = '== Information ==';
        private SHOPS_STAIRS_HEADER: string = '== Shops and Stairs ==';
        private QUESTS_HEADER: string = '== Quests ==';
        private CREATURES_HEADER: string = '== Creatures ==';
        private MAP_HEADER: string = '== Map ==';

        private SPACER: string = '|width="50%" valign="top" align="left"|';
        private NONE: string = '* {{none}}';
        private MAP_NOTE: string = '{{MapNote|image=%url%|target=%target%|type=%type%}}';

        private HOST_URL: string = "http://huntedcow.cachefly.net/fs";
        private TILE_URL: string = this.HOST_URL + "/tiles/%set%_%tile%.gif";
        private LOCATION_URL: string = this.HOST_URL + "/locations/%tile%.gif";
        private STAIR_URL: string = this.HOST_URL + "/stairways/%tile%.gif";
        private RELIC_URL: string = this.HOST_URL + "/relics/%tile%.gif";
        private PORTAL_URL: string = this.HOST_URL + "/portals/%tile%.gif";
        private SHOP_URL: string = this.HOST_URL + "/shops/%tile%.gif";

        /*
         * Start conversion from source code to {@link G2W.Data.data} object.
         *  
         * @param {@link String} WIKI source code
         */
        start(source: G2W.Data.data) {
            var wiki = "";
            wiki = this.generateHeader(wiki, source);
            wiki = this.generateInformation(wiki, source.basic);
            wiki = this.generateShopsStairs(wiki, source);
            wiki = this.generateQuests(wiki, source.quests);
            wiki = this.generateCreatures(wiki, source.creatures);
            wiki = this.generateMap(wiki, source);
            wiki = this.generateFooter(wiki, source);

            return wiki;
        }

        generateHeader(wiki: string, source: G2W.Data.data) {
            wiki = append(wiki, '__NOTOC__');
            wiki = append(wiki, '{|cellpadding="5" width="100%"');
            wiki = append(wiki, this.SPACER);

            return wiki;
        }

        generateInformation(wiki: string, source: G2W.Data.Basic) {
            wiki = append(wiki, this.INFORMATION_HEADER);
            wiki = append(wiki, '* Min Level: ' + source.level);

            return wiki;
        }

        generateShopsStairs(wiki: string, source: G2W.Data.data) {
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
        }

        generateQuests(wiki: string, quests: G2W.Data.Quest[]) {
            wiki = append(wiki, this.QUESTS_HEADER);

            // Remove dummy quest
            quests.shift();

            if (quests.length == 0) {
                wiki = append(wiki, this.NONE);
            } else {
                for (var i in quests) {
                    var q = quests[i];
                    wiki = appendReplaced(wiki, this.QUEST_TEMPLATE, ["%name%", q.name, "%x%", q.x, "%y%", q.y]);
                }
            }

            return wiki;
        }

        generateCreatures(wiki: string, creatures: G2W.Data.Creature[]) {
            wiki = append(wiki, this.CREATURES_HEADER);

            if (creatures.length == 0) {
                wiki = append(wiki, this.NONE);
            } else {
                for (var i in creatures) {
                    var c = creatures[i];
                    wiki = appendReplaced(wiki, this.CREATURE_TEMPLATE, ["%name%", c.name, "%type%", c.type]);
                }
            }

            wiki = append(wiki, '|}');            
            return wiki;
        }

        generateMap(wiki: string, data: G2W.Data.data) {
            var map = data.map;
            
            wiki = append(wiki, this.MAP_HEADER);
            wiki = append(wiki, '{{Map}}');
            wiki = append(wiki, '');
            wiki = append(wiki, '<center>');
            
            wiki = append(wiki, '{| cellspacing="1" cellpadding="0" style="text-align:center"');

            // Header numbering
            wiki = append(wiki, '|&nbsp;');
            for (var i = 0; i < map.width; i++) {
                wiki = append(wiki, '|' + i);
            }
            wiki = append(wiki, '|&nbsp;');

            for (var y = 0; y < map.height; y++) {
                wiki = append(wiki, '|-');
                wiki = append(wiki, '|' + y);

                for (var x = 0; x < map.width; x++) {
                    var imgRec = map.layout[y][x],
                        imgType = imgRec.substring(0, 1),
                        img = imgRec.substring(1),
                        imgUrl = undefined;

                    switch (imgType) {
                        case "a":
                            imgUrl = this.STAIR_URL;
                            var stair = data.getStairAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%",imgUrl,"%target%",stair.name,"%type%", stair.type]);
                            break;
                        case "r":
                            imgUrl = this.RELIC_URL;
                            var relic = data.getRelicAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%",imgUrl,"%target%",relic.name,"%type%", relic.type]);
                            break;
                        case "s":
                            imgUrl = this.SHOP_URL;
                            var shop = data.getShopAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%",imgUrl,"%target%",shop.name,"%type%", shop.type]);
                            break;
                        case "p":
                            imgUrl = this.PORTAL_URL;
                            var portal = data.getPortalAt(x, y);
                            imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%",imgUrl,"%target%",portal.name,"%type%", portal.type]);
                            break;
                        case "l":
                            imgUrl = this.LOCATION_URL;
                            var quest = data.getQuestAt(x, y);
                            if(quest != undefined){
                                imgUrl = appendReplaced("", this.MAP_NOTE, ["%url%",imgUrl,"%target%",quest.name,"%type%", "Q"]);
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
                wiki = append(wiki, '|-');
            }

            // Footer numbering
            wiki = append(wiki, '|&nbsp;');
            for (var i = 0; i < map.width; i++) {
                wiki = append(wiki, '|' + i);
            }
            wiki = append(wiki, '|&nbsp;');

            wiki = append(wiki, '</center>');

            return wiki;
        }

        generateFooter(wiki: string, source: G2W.Data.data) {
            return append(wiki, '[[Category:Areas]]');
        }
    }
}
