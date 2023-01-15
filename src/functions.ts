import {JSDOM} from "jsdom";
import oldAnimeList from "./oldAnimeList.json";
import fs from "fs";
import {Client, Guild, GuildBasedChannel, TextChannel} from "discord.js";

/**
 * Fetch a web page designated by its url and return the Document
 * @param url Page url to fetch
 * @return Page Document
 */
export function fetchPage(url: string): Promise<void | Document> {
   return fetch(url)
       // Get the html content of the page
       .then(res => res.text())
       .then(HTMLData => {
          // Transforms html into Document Object Model
          const dom = new JSDOM(HTMLData);
          return dom.window.document;
       })
       .catch((error) => {
          console.error(`There was an error with the fetch.`);
          console.error(error);
       });
}

/***
 * Navigate the Document to get all the anime urls.
 * The function returns only the list of the anime url that have been published during the interval
 * @param document Document of the page
 * @return List of new anime urls
 */
export function parseAnimes(document: Document): string[] {
   let animeList = []
   const listAnchor: HTMLCollection = document.getElementsByTagName('a')

   //For each html anchor "<a>"
   for (let i = 0; i < listAnchor.length; i++) {
      let href: string | null = listAnchor[i].getAttribute("href")
      let classNames: string = listAnchor[i].className
      if (!href || classNames || !listAnchor[i].childElementCount) continue;

      // Verification that the anchor contains a child with an image
      let imgAnimeElement: HTMLCollection = listAnchor[i].getElementsByTagName("img")
      if (imgAnimeElement.length !== 1) continue;

      // Checking the source of the image
      let imgAnimeSrc: string | null = imgAnimeElement[0].getAttribute("src")
      if (!imgAnimeSrc || !imgAnimeSrc.includes("mavanimes.co/wp-content/uploads/")) continue

      if (href.includes("mavanimes.co")) {
         animeList.push(href)
      }
   }

   return animeList;
}

/**
 * Calls the function parseAnimes
 * For each url, the callback function is called
 * @param callback
 */
export function check(callback: (anime: string) => void) {
   fetchPage('https://mavanimes.co').then(document => {
      if (!document) return;
      const newAnimeList = parseAnimes(document)

      //Difference between the old list and the new one
      const newAnimes = newAnimeList.filter(item => oldAnimeList.indexOf(item) < 0);

      console.log(new Date().toLocaleString() + " Site fetch, " + newAnimes.length + " new anime online")
      for (let anime of newAnimes) {
         oldAnimeList.push(anime)
         callback(anime)
      }

      fs.writeFileSync('./src/oldAnimeList.json', JSON.stringify(newAnimeList))
   })
}

/**
 * Sends a message in the given channel or returns an error
 * @param client
 * @param anime
 * @param guild
 * @param channel
 */
export async function sendMessage(client: Client, anime: string, guild: Guild, channel: GuildBasedChannel | null) {
   try {
      //If the discord channel is a text-based channel
      if (!channel?.isTextBased) {
         console.error("Error: Invalid Channel Type")
         process.exit(1)
      }

      await (channel as TextChannel).send(anime)
   } catch (e) {
      console.error("Error: An error occurred during the sending of messages")
   }
}