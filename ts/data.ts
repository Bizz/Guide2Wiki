module G2W.Data {

    /*
     * Information holder object.
     *
     * @author bizzpu17
     */
    export class data {
        public basic: Basic;
        public creatures: Creature[];
        public quests: Quest[];
        public stairs: Stair[];
        public relics: Relic[];
        public shops: Shop[];
        public portals: Portal[];
        public map: MapLayout;

        constructor() {
            this.basic = new Basic();
            this.creatures = [];
            this.quests = [];
            this.stairs = [];
            this.relics = [];
            this.shops = [];
            this.portals = [];
            this.map = new MapLayout();
        }

        addCreature(creature: Creature) {
            this.creatures.push(creature);
        }

        addQuest(quest: Quest) {
            this.quests.push(quest);
        }

        getQuestAt(x: number, y: number) {
            for (var i in this.quests) {
                var q = this.quests[i];
                if (q.x == x && q.y == y) {
                    return q;
                }
            }
            return undefined;
        }

        addStair(stair: Stair) {
            this.stairs.push(stair);
        }

        getStairAt(x: number, y: number) {
            for (var i in this.stairs) {
                var a = this.stairs[i];
                if (a.x == x && a.y == y) {
                    return a;
                }
            }
            return undefined;
        }

        addRelic(relic: Relic) {
            this.relics.push(relic);
        }

        getRelicAt(x: number, y: number) {
            for (var i in this.relics) {
                var r = this.relics[i];
                if (r.x == x && r.y == y) {
                    return r;
                }
            }
            return undefined;
        }

        addShop(shop: Shop) {
            this.shops.push(shop);
        }

        getShopAt(x: number, y: number) {
            for (var i in this.shops) {
                var s = this.shops[i];
                if (s.x == x && s.y == y) {
                    return s;
                }
            }
            return undefined;
        }

        getShopByName(name: string) {
            for(var i in this.shops){
                var s = this.shops[i];
                if(s.name == name){
                    return s;
                }
            }
            return undefined;
        }

        addPortal(portal: Portal) {
            this.portals.push(portal);
        }

        getPortalAt(x: number, y: number) {
            for (var i in this.portals) {
                var p = this.portals[i];
                if (p.x == x && p.y == y) {
                    return p;
                }
            }
            return undefined;
        }

        toJson() {
            return JSON.stringify(this);
        }
    }

    /*
     * Possible map location types with short-codes 
     *
     * @author bizzpu17
     */
    export enum MapLocationType {
        S = 1,  // Shop
        A = 2,  // Stair
        WA = 3, // World Area
        P = 4,   // Portal
        R = 5   // Relic
    }

    /*
     * Basic information object.
     *
     * @author bizzpu17
     */
    export class Basic {
        public level: number;
        public locations: string[];

        constructor() {
            this.locations = [];
        }

        addLocation(location: string) {
            this.locations.push(location);
        }
    }

    /*
     * Creature object.
     *
     * @author bizzpu17
     */
    export class Creature {
        public name: string;
        public type: string;

        constructor() { }

        parse(fullName: string) {
            this.type = fullName.substring(fullName.lastIndexOf("("));
            this.name = fullName.substring(0, fullName.lastIndexOf("(") - 1);
        }
    }

    export interface ISelectable {
        name: string;
        x: number;
        y: number;
    }

    export interface IInputable {
        name: string;
        x: number;
        y: number;
    }

    /*
     * Quest object.
     *
     * @author bizzpu17
     */
    export class Quest implements ISelectable {
        public id: number;
        public x: number;
        public y: number;
        public name: string;

        constructor() { }
    }

    /*
     * Stair object.
     *
     * @author bizzpu17
     */
    export class Relic implements ISelectable {
        public name: string;
        public x: number;
        public y: number;
        public type: string;

        constructor() {
            this.type = MapLocationType[MapLocationType.R];
        }
    }

    /*
     * Stair object.
     *
     * @author bizzpu17
     */
    export class Stair implements ISelectable {
        public name: string;
        public x: number;
        public y: number;
        public type: string;

        constructor(isMaster: boolean) {
            if (isMaster) {
                this.type = MapLocationType[MapLocationType.WA];
            } else {
                this.type = MapLocationType[MapLocationType.A];
            }
        }
    }

    /*
     * Shop object.
     *
     * @author bizzpu17
     */
    export class Shop implements ISelectable {
        public name: string;
        public x: number;
        public y: number;
        public type: string;

        constructor() {
            this.type = MapLocationType[MapLocationType.S];
        }
    }

    /*
     * Portal object.
     *
     * @author bizzpu17
     */
    export class Portal implements IInputable {
        public name: string;
        public x: number;
        public y: number;
        public type: string;

        constructor() {
            this.type = MapLocationType[MapLocationType.P];
        }
    }

    /*
     * MapLayout object.Stair
     *
     * @author bizzpu17
     */
    export class MapLayout {
        public width: number;
        public height: number;
        public tileSet: string;
        public layout: string[][];
        private generatedMap: string;

        constructor() {
            this.layout = [];
        }

        generateMap() {
            if (this.generatedMap == undefined) {
                var table = document.createElement("table"),
                    urlHost = "http://huntedcow.cachefly.net/fs",
                    tileUrl = urlHost + "/tiles/%set%_%tile%.gif",
                    locationUrl = urlHost + "/locations/%tile%.gif",
                    stairUrl = urlHost + "/stairways/%tile%.gif",
                    relicUrl = urlHost + "/relics/%tile%.gif",
                    portalUrl = urlHost + "/portals/%tile%.gif",
                    shopsUrl = urlHost + "/shops/%tile%.gif";

                table.border = "2";
                table.cellSpacing = "0";
                table.cellPadding = "0";
                table.classList.add("map");
                table.style.margin = "0 auto";

                for (var y = 0; y < this.layout.length; y++) {
                    var tr = document.createElement("tr");
                    for (var x = 0; x < this.layout[y].length; x++) {
                        var td = document.createElement("td"),
                            img = document.createElement("img"),
                            tileRecord = this.layout[y][x],
                            tileType = tileRecord.substring(0, 1),
                            tile = tileRecord.substring(1),
                            imgUrl = undefined;

                        switch (tileType) {
                            case "a":
                                imgUrl = stairUrl; break;
                            case "r":
                                imgUrl = relicUrl; break;
                            case "s":
                                imgUrl = shopsUrl; break;
                            case "p":
                                imgUrl = portalUrl; break;
                            case "l":
                                imgUrl = locationUrl; break;
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
        }
    }

    var dataObject = undefined;

    /*
     * Factory method
     */
    export function getData() {
        if (dataObject == undefined) {
            dataObject = new data();
        }
        return dataObject;
    }

    export function resetData() {
        dataObject = new data();
        G2W.Utils.getById("cm-map").innerHTML = "";
    }
}