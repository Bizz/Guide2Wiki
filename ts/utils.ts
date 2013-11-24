module G2W {
    /*
     * Utility class.
     * 
     * @author bizzpu17
     */
    export class Utils {
        constructor() { }

        /*
         * Gets all elements with specific id attribute.
         * {@see getByIdElem} for more info.
         * 
         * @param elem {@link any}
         * @param id {@link string}
         */
        static getById(id: string) {
            return Utils.getByIdElem(document, id);
        }

        /*
         * Gets all elements with specific id attribute.
         *  - If only one element founded - return element
         *  - If no offset provided - return all matches
         *  - If offset provided - return element on offset
         * 
         * @param elem {@link any}
         * @param id {@link string}
         */
        static getByIdElem(elem: any, id: string) {
            return elem.getElementById(id);
        }

        /*
         * Gets all elements with specific CSS class.
         * {@see getByClassElem} for more info.
         * 
         * @param elem {@link any}
         * @param clazz {@link string}
         * @param offest {@link number} - optional
         */
        static getByClass(clazz: string, offset?: number) {
            return Utils.getByClassElem(document, clazz, offset);
        }

        /*
         * Gets all elements with specific CSS class.
         *  - If only one element founded - return element
         *  - If no offset provided - return all matches
         *  - If offset provided - return element on offset
         * 
         * @param elem {@link any}
         * @param clazz {@link string}
         * @param offest {@link number} - optional
         */
        static getByClassElem(elem: any, clazz: string, offset?: number) {
            var c = elem.getElementsByClassName(clazz);
            return c.length == 1 ? c[0] : (offset != undefined ? c[offset] : c);
        }

        /*
         * Gets all elements with specific tag name.
         * {@see getByTagElem} for more info.
         * 
         * @param elem {@link any}
         * @param tag {@link string}
         * @param offest {@link number} - optional
         */
        static getByTag(tag: string, offset?: number) {
            return Utils.getByTagElem(document, tag, offset);
        }

        /*
         * Gets all elements with specific tag name.
         *  - If only one element founded - return element
         *  - If no offset provided - return all matches
         *  - If offset provided - return element on offset
         * 
         * @param elem {@link any}
         * @param tag {@link string}
         * @param offest {@link number} - optional
         */
        static getByTagElem(elem: any, tag: string, offset?: number) {
            var t = elem.getElementsByTagName(tag);
            return t.length == 1 ? t[0] : (offset != undefined ? t[offset] : t);
        }

        /*
         * Attach event handler on provided element.
         * 
         * @param elem {@link any}
         * @param event {@link string}
         * @param func {@link function}
         */
        static attachEvent(elem: any, event: string, func: () => void) {
            elem.attributes[event].value = func;
        }

        /*
         * Convert {@link string} to {@link HTMLDocument}
         * 
         * @param str {@link string}
         */
        static toDom(str: string) {
            return new DOMParser().parseFromString(str, "text/html");
        }

        /*
         * Gets attribute from element.
         * 
         * @param attribute {@link string}
         */
        static getAttr(elem: any, attr: string) {
            var attrs = elem.attributes;
            if (attrs[attr] == undefined)
                return undefined;

            return attrs[attr].value;
        }

        static substr(target: string, start: string, end?: number) {
            if (end != undefined)
                return target.substring(target.indexOf(start) + start.length, end);

            return target.substring(target.indexOf(start) + start.length);
        }

        static substring(target: string, start: string, end: string) {
            return target.substring(target.indexOf(start) + start.length, target.indexOf(end));
        }

        static substringLast(target: string, start: string, end: string) {
            return target.substring(target.lastIndexOf(start) + start.length, target.indexOf(end));
        }

        static getBox(dom: any, header: string) {
            var offset = this.hasHeader(dom, header),
                next = this.findNextHeader(dom, offset);

            if (offset > -1)
                return this.fetchBox(dom, offset + 1, next - 1);
            return undefined;
        }

        static hasHeader(dom: any, header: string) {
            // table[3].tbody.tr
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
        }

        static findNextHeader(dom: any, start: number) {
            // table[3].tbody.tr
            var rows = G2W.Utils.getByTagElem(dom, "table", 5).childNodes[1].childNodes;
            for (var i = start + 1; i < rows.length; i++) {
                var row = rows[i];
                if (row.childNodes.length > 0) {
                    if (G2W.Utils.getAttr(row.firstChild, "class") == "tHeader") {
                        return i;
                    }
                }
            }
            // After creatures section there are no tHeader
            return rows.length - 1;
        }

        static fetchBox(dom: any, start: number, end: number) {
            var elements = [];

            var rows = G2W.Utils.getByTagElem(dom, "table", 5).childNodes[1].childNodes;
            for (var i = start; i < end; i++) {
                elements.push(rows[i]);
            }

            return elements;
        }
        
        static showAlertBox(type?: string){
            var box = this.getById("alertbox"),
                message = "Generation success.",
                title = "Success!",
                clazz = "success";
            
            if(type == "danger"){
                message = "Error occured while generating wiki code. Please open Your JavaScript console and report error to creator.";
                title = "Oh snap!";
                clazz = "danger";
            }
            
            box.classList.remove("hidden");
            box.classList.remove("alert-danger");
            box.classList.remove("alert-success");
            
            box.classList.add("alert-" + clazz);
            box.innerHTML = "<strong>" + title + "</strong> " + message;
        }
        
        static closeAlertBox(){
            var box = this.getById("alertbox").classList.add("hidden");
        }
    }

    export module CustomDialogs {

        var queueObject = undefined;
        var current = undefined;

        /*
         * Factory method
         */
        export function getQueue() {
            if (queueObject == undefined) {
                queueObject = new CustomDialogQueue();
            }
            return queueObject;
        }

        export function getCurrent() {
            return current;
        }

        export function next() {
            current = queueObject.queue.shift();
            return current;
        }

        export class CustomDialogQueue {
            private queue: ICustomDialog[];

            constructor() {
                this.queue = [];
            }

            add(dialog: ICustomDialog) {
                this.queue.push(dialog);
            }
        }

        export enum CustomDialogType {
            Relic = 1,
            Shop = 2,
            Quest = 3,
            Portal = 4
        }

        export interface ICustomDialog {
            type: CustomDialogType;
            x: number;
            y: number;

            open();
            close();
        }

        export class CustomInputDialog implements ICustomDialog {
            public type: CustomDialogType;
            public target: G2W.Data.IInputable;
            public input: string;
            public x: number;
            public y: number;

            constructor(type: CustomDialogType, target: G2W.Data.IInputable, x: number, y: number) {
                this.type = type;
                this.target = target;
                this.x = x;
                this.y = y;
            }

            open() {
                var modal = G2W.Utils.getById("customModal"),
                    modalMessage = G2W.Utils.getById("cm-message"),
                    modalData = G2W.Utils.getById("cm-data"),
                    modalMap = G2W.Utils.getById("cm-map"),
                    inputObj = document.createElement("input");

                modalMessage.innerHTML = "There is <b>" + CustomDialogType[this.type] + "</b> on (" + this.x + "," + this.y + ").<br />Please select which one is:";

                inputObj.id = "cDialogInput";
                modalData.innerHTML = "";
                modalData.appendChild(inputObj);

                var map = G2W.Data.getData().map,
                    calcWidth = map.width * 27 + 62; // 27 = 25 border + 2 space, 42 = 40 left + right padding + 2 last right border

                if (calcWidth < 580) calcWidth = 580;

                modalMap.innerHTML = map.generateMap();
                $(".modal-dialog").animate({ width: calcWidth + "px" }, 400);

                var location = G2W.Utils.getById("m" + this.x + "_" + this.y);
                location.classList.add("selected");

                $('#customModal').modal('show');
            }

            close() {
                var inputed = G2W.Utils.getById("cDialogInput").value;

                this.target.name = inputed;
                this.target.x = this.x;
                this.target.y = this.y;

                G2W.nextDialog();
            }
        }

        export class CustomSelectDialog implements ICustomDialog {
            public type: CustomDialogType;
            public list: G2W.Data.ISelectable[];
            public x: number;
            public y: number;
            private select: string[];
            private selected: number;

            constructor(type: CustomDialogType, list: G2W.Data.ISelectable[], x: number, y: number) {
                this.type = type;
                this.list = list;
                this.x = x;
                this.y = y;
                this.select = [];
            }

            open() {
                var modal = G2W.Utils.getById("customModal"),
                    modalMessage = G2W.Utils.getById("cm-message"),
                    modalData = G2W.Utils.getById("cm-data"),
                    modalMap = G2W.Utils.getById("cm-map"),
                    selectObj = document.createElement("select");

                if (this.type != CustomDialogType.Quest) {
                    modalMessage.innerHTML = "There is <b>" + CustomDialogType[this.type] + "</b> on (" + this.x + "," + this.y + ").<br />Please select which one is:";
                } else {
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

                var map = G2W.Data.getData().map,
                    calcWidth = map.width * 27 + 62; // 27 = 25 border + 2 space, 42 = 40 left + right padding + 2 last right border

                if (calcWidth < 580) calcWidth = 580;

                modalMap.innerHTML = map.generateMap();
                $(".modal-dialog").animate({ width: calcWidth + "px" }, 400);

                var location = G2W.Utils.getById("m" + this.x + "_" + this.y);
                location.classList.add("selected");

                $('#customModal').modal('show');
            }

            close() {
                var selected = parseInt(G2W.Utils.getById("cDialogSelect").value),
                    obj = this.list[selected];

                obj.x = this.x;
                obj.y = this.y;

                G2W.nextDialog();
            }
        }
    }
}