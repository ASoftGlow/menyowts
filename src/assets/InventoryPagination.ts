// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.Pagination = void 0;
// const discord_js_1 = require("discord.js");
// const GeneratePage_js_1 = require("./functions/GeneratePage.js");
// const types_js_1 = require("./types.js");
// class Pagination {
//     sendTo;
//     pages;
//     maxLength;
//     currentPage;
//     option;
//     collector;
//     message;
//     _isSent = false;
//     _isFollowUp = false;
//     get isSent() {
//         return this._isSent;
//     }
//     constructor(sendTo, pages, config) {
//         this.sendTo = sendTo;
//         this.pages = pages;
//         /**
//          * page length of pagination
//          */
//         this.maxLength = Array.isArray(pages) ? pages.length : pages.maxLength;
//         /**
//          * default options
//          */
//         this.option =
//             config ??
//                 (this.maxLength < 20
//                     ? { type: types_js_1.PaginationType.Button }
//                     : { type: types_js_1.PaginationType.SelectMenu });
//         /**
//          * Current page
//          */
//         this.currentPage = config?.initialPage ?? 0;
//         /**
//          * Since direct editing isn't available on ephemeral, disable exit mode
//          */
//         if (this.option.ephemeral && this.option.enableExit) {
//             throw Error("Ephemeral pagination does not support exit mode");
//         }
//     }
//     /**
//      * Unable to update pagination error
//      */
//     unableToUpdate() {
//         if (this.option.debug) {
//             console.log("pagination: unable to update pagination");
//         }
//     }
//     /**
//      * Get page
//      *
//      * @param page
//      *
//      * @returns
//      */
//     getPage = async (page) => {
//         const embed = Array.isArray(this.pages)
//             ? lodash_1.default.cloneDeep(this.pages[page])
//             : await this.pages.resolver(page, this);
//         if (!embed) {
//             return;
//         }
//         return (0, GeneratePage_js_1.GeneratePage)(embed, this.currentPage, this.maxLength, this.option);
//     };
//     /**
//      * Send pagination
//      * @returns
//      */
//     async send() {
//         // If pagination has already been sent, throw an error
//         if (this._isSent) {
//             throw Error("Pagination: has already been sent");
//         }
//         // Prepare initial message
//         const page = await this.getPage(this.currentPage);
//         if (!page) {
//             throw Error("Pagination: out of bound page");
//         }
//         // Add a pagination row to components
//         if (page.newMessage.components) {
//             page.newMessage.components.push(page.paginationRow);
//         }
//         else {
//             page.newMessage.components = [page.paginationRow];
//         }
//         let message;
//         // Send embed
//         if (this.sendTo instanceof discord_js_1.Message) {
//             message = await this.sendTo.reply(page.newMessage);
//         }
//         else if (this.sendTo instanceof discord_js_1.CommandInteraction ||
//             this.sendTo instanceof discord_js_1.MessageComponentInteraction ||
//             this.sendTo instanceof discord_js_1.ContextMenuCommandInteraction) {
//             // To ensure pagination is a follow-up
//             if (this.sendTo.deferred || this.sendTo.replied) {
//                 this._isFollowUp = true;
//             }
//             // send message
//             const reply = this.sendTo.deferred || this.sendTo.replied
//                 ? await this.sendTo.followUp({
//                     ...page.newMessage,
//                     ephemeral: this.option.ephemeral,
//                     fetchReply: true,
//                 })
//                 : await this.sendTo.reply({
//                     ...page.newMessage,
//                     ephemeral: this.option.ephemeral,
//                     fetchReply: true,
//                 });
//             // If the message response is not received, throw an error
//             if (!(reply instanceof discord_js_1.Message)) {
//                 throw Error("Missing Intent: GUILD_MESSAGES\nWithout guild message intent, pagination does not work, Consider adding GUILD_MESSAGES as an intent\nread more at https://discordx.js.org/docs/faq/Errors/Pagination#missing-intent-guild_messages");
//             }
//             message = reply;
//         }
//         else {
//             message = await this.sendTo.send(page.newMessage);
//         }
//         // Check if page were sent
//         if (!message) {
//             throw Error("Pagination: Failed to send page to discord");
//         }
//         // create collector
//         const collector = message.createMessageComponentCollector({
//             ...this.option,
//             componentType: this.option.type === types_js_1.PaginationType.Button
//                 ? discord_js_1.ComponentType.Button
//                 : discord_js_1.ComponentType.StringSelect,
//             time: this.option.time ?? types_js_1.defaultTime,
//         });
//         /**
//          * Reset collector timer
//          */
//         const resetCollectorTimer = () => {
//             collector.resetTimer({
//                 idle: this.option.idle,
//                 time: this.option.time ?? types_js_1.defaultTime,
//             });
//         };
//         collector.on("collect", async (collectInteraction) => {
//             if (collectInteraction.isButton() &&
//                 this.option.type === types_js_1.PaginationType.Button) {
//                 if (collectInteraction.customId ===
//                     (this.option.exit?.id ?? types_js_1.defaultIds.buttons.exit)) {
//                     // Exit pagination if exit is requested
//                     collector.stop();
//                     return;
//                 }
//                 else if (collectInteraction.customId ===
//                     (this.option.start?.id ?? types_js_1.defaultIds.buttons.start)) {
//                     // Requested start page
//                     this.currentPage = 0;
//                 }
//                 else if (collectInteraction.customId ===
//                     (this.option.end?.id ?? types_js_1.defaultIds.buttons.end)) {
//                     // Requested end page
//                     this.currentPage = this.maxLength - 1;
//                 }
//                 else if (collectInteraction.customId ===
//                     (this.option.next?.id ?? types_js_1.defaultIds.buttons.next)) {
//                     // Requested next page
//                     if (this.currentPage < this.maxLength - 1) {
//                         this.currentPage++;
//                     }
//                 }
//                 else if (collectInteraction.customId ===
//                     (this.option.previous?.id ?? types_js_1.defaultIds.buttons.previous)) {
//                     // Requested previous page
//                     if (this.currentPage > 0) {
//                         this.currentPage--;
//                     }
//                 }
//                 else {
//                     return;
//                 }
//                 await collectInteraction.deferUpdate();
//                 resetCollectorTimer();
//                 // Get page
//                 const pageEx = await this.getPage(this.currentPage);
//                 if (!pageEx) {
//                     throw Error("Pagination: out of bound page");
//                 }
//                 // Add pagination row
//                 if (pageEx.newMessage.components) {
//                     pageEx.newMessage.components.push(pageEx.paginationRow);
//                 }
//                 else {
//                     pageEx.newMessage.components = [pageEx.paginationRow];
//                 }
//                 // Update message
//                 await collectInteraction
//                     .editReply(pageEx.newMessage)
//                     .catch(() => this.unableToUpdate());
//             }
//             else if (collectInteraction.isStringSelectMenu() &&
//                 this.option.type === types_js_1.PaginationType.SelectMenu &&
//                 collectInteraction.customId === (this.option.menuId ?? types_js_1.defaultIds.menu)) {
//                 await collectInteraction.deferUpdate();
//                 resetCollectorTimer();
//                 this.currentPage = Number(collectInteraction.values[0] ?? 0);
//                 // Exit pagination if exit is requested
//                 if (this.currentPage === types_js_1.SelectMenuPageId.Exit) {
//                     collector.stop();
//                     return;
//                 }
//                 // Requested start page
//                 if (this.currentPage === types_js_1.SelectMenuPageId.Start) {
//                     this.currentPage = 0;
//                 }
//                 // Requested end page
//                 if (this.currentPage === types_js_1.SelectMenuPageId.End) {
//                     this.currentPage = this.maxLength - 1;
//                 }
//                 // Update page
//                 const pageEx = await this.getPage(this.currentPage);
//                 if (!pageEx) {
//                     throw Error("Pagination: out of bound page");
//                 }
//                 if (pageEx.newMessage.components) {
//                     pageEx.newMessage.components.push(pageEx.paginationRow);
//                 }
//                 else {
//                     pageEx.newMessage.components = [pageEx.paginationRow];
//                 }
//                 await collectInteraction
//                     .editReply(pageEx.newMessage)
//                     .catch(() => this.unableToUpdate());
//             }
//         });
//         collector.on("end", async () => {
//             const finalPage = await this.getPage(this.currentPage);
//             if (message.editable && finalPage) {
//                 // Reset page components
//                 if (!finalPage.newMessage.components) {
//                     finalPage.newMessage.components = [];
//                 }
//                 // Eliminate the ephemeral pagination error, since direct editing cannot be performed
//                 if (this.option.ephemeral &&
//                     this.sendTo instanceof discord_js_1.ChatInputCommandInteraction) {
//                     if (!this._isFollowUp) {
//                         await this.sendTo
//                             .editReply(finalPage.newMessage)
//                             .catch(() => this.unableToUpdate());
//                     }
//                 }
//                 else {
//                     await message
//                         .edit(finalPage.newMessage)
//                         .catch(() => this.unableToUpdate());
//                 }
//             }
//             // Perform pagination timeout
//             if (this.option.onTimeout) {
//                 this.option.onTimeout(this.currentPage, message);
//             }
//         });
//         this.collector = collector;
//         this.message = message;
//         this._isSent = true;
//         return { collector, message };
//     }
// }
// exports.Pagination = Pagination;
// //# sourceMappingURL=Pagination.js.map