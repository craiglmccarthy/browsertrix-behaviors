/* src/site/icaew-com.js */
import { Behavior } from "../lib/behavior";
import { xpathNode } from "../lib/utils";

const Q = {
  commentListContainer: '//*[@id="ti0c9p-interchange"]'
};

export const BREADTH_ALL = Symbol("BREADTH_ALL");

export class IcaewComBehavior extends Behavior {
  static get name() {
    return "ICAEW.com";
  }

  static isMatch() {
    const pathRegex = /https:\/\/(www\.)?icaew\.com.*/;
    return window.location.href.match(pathRegex);
  }

  constructor() {
    super();
  }

  async* [Symbol.asyncIterator]() {
    // console.log(Q)
    const commentList = xpathNode(Q.commentListContainer);
    console.log("[LOG] List Container", commentList);
    console.log('Make navbar pink!')

    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    
    getElementByXpath("/html/body/header/nav/section/ul[2]").style.backgroundColor = 'pink'
    yield "ICAEW.com Behavior Complete";
  }
}