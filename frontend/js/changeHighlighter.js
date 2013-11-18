(function(markmon){
    "use strict";

    var marker = document.createElement("span"),
        highlighter = document.createElement("div");

    marker.className = "last-change-marker";
    highlighter.className = "highlighter";

    document.body.appendChild(highlighter);

    var isChangingTextNode = false,
        oriNode = null,
        spanNode = null;

    markmon.changeHighlighter = {
        removeMarker: function(){
            if(!marker.parentElement) return;
            marker.parentElement.removeChild(marker);
            if(isChangingTextNode){
                var container = spanNode.parentElement;
                var ind = [].indexOf.call(container.childNodes, spanNode);
                container.removeChild(spanNode);
                if(ind === container.childNodes.length){
                    container.appendChild(oriNode);
                } else {
                    container.insertBefore(oriNode, container.childNodes[ind]);
                }
            }
        },
        addMarkerTo: function(node, prevNode){
            var ind;
            if(prevNode && !node.innerHTML && !prevNode.innerHTMl){
                isChangingTextNode = true;
                var ori = prevNode.data,
                    now = node.data;
                var l1 = ori.length - 1, l2 = now.length - 1;
                while(l1 && l2 && ori.charAt(l1) === now.charAt(l2)){
                    l1--;
                    l2--;
                }
                l2++;
                oriNode = node;
                var container = node.parentElement;
                ind = [].indexOf.call(container.childNodes, oriNode);
                container.removeChild(oriNode);
                spanNode = document.createElement("span");
                var before = document.createTextNode(now.substr(0, l2)),
                    after = document.createTextNode(now.substr(l2, now.length - l2));
                spanNode.appendChild(before);
                spanNode.appendChild(marker);
                spanNode.appendChild(after);
                if(ind === container.childNodes.length){
                    container.appendChild(spanNode);
                } else {
                    container.insertBefore(spanNode, container.childNodes[ind]);
                }
            } else {
                isChangingTextNode = false;
                ind = [].indexOf.call(node.parentElement.childNodes, node) + 1;
                if(ind === node.parentElement.childNodes.length){
                    node.parentElement.appendChild(marker);
                } else {
                    node.parentElement.insertBefore(marker, node.parentElement.childNodes[ind]);
                }
            }
        },
        getMarkerY: function(){
            return marker.getBoundingClientRect().bottom + window.scrollY;
        },
        syncHighlighter: function(){
            highlighter.style.top = this.getMarkerY() + "px";
        }
    };

    window.onresize = function(){
        markmon.changeHighlighter.syncHighlighter();
    };

})(window.markmon ? window.markmon : window.markmon = {});