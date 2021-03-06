"use strict";
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
Object.defineProperty(exports, "__esModule", { value: true });
// Exports the webpack plugins we use internally.
var base_href_webpack_plugin_1 = require("../lib/base-href-webpack/base-href-webpack-plugin");
exports.BaseHrefWebpackPlugin = base_href_webpack_plugin_1.BaseHrefWebpackPlugin;
var cleancss_webpack_plugin_1 = require("./cleancss-webpack-plugin");
exports.CleanCssWebpackPlugin = cleancss_webpack_plugin_1.CleanCssWebpackPlugin;
var bundle_budget_1 = require("./bundle-budget");
exports.BundleBudgetPlugin = bundle_budget_1.BundleBudgetPlugin;
var scripts_webpack_plugin_1 = require("./scripts-webpack-plugin");
exports.ScriptsWebpackPlugin = scripts_webpack_plugin_1.ScriptsWebpackPlugin;
var suppress_entry_chunks_webpack_plugin_1 = require("./suppress-entry-chunks-webpack-plugin");
exports.SuppressExtractedTextChunksWebpackPlugin = suppress_entry_chunks_webpack_plugin_1.SuppressExtractedTextChunksWebpackPlugin;
var postcss_cli_resources_1 = require("./postcss-cli-resources");
exports.PostcssCliResources = postcss_cli_resources_1.default;
const path_1 = require("path");
exports.RawCssLoader = require.resolve(path_1.join(__dirname, 'raw-css-loader'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci9zcmMvYW5ndWxhci1jbGktZmlsZXMvcGx1Z2lucy93ZWJwYWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkFBaUI7QUFDakIsK0RBQStEOztBQUUvRCxpREFBaUQ7QUFDakQsOEZBQTBGO0FBQWpGLDJEQUFBLHFCQUFxQixDQUFBO0FBQzlCLHFFQUFnRztBQUF2RiwwREFBQSxxQkFBcUIsQ0FBQTtBQUM5QixpREFBZ0Y7QUFBdkUsNkNBQUEsa0JBQWtCLENBQUE7QUFDM0IsbUVBQTZGO0FBQXBGLHdEQUFBLG9CQUFvQixDQUFBO0FBQzdCLCtGQUFrRztBQUF6RiwwRkFBQSx3Q0FBd0MsQ0FBQTtBQUNqRCxpRUFHaUM7QUFGL0Isc0RBQUEsT0FBTyxDQUF1QjtBQUloQywrQkFBNEI7QUFDZixRQUFBLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGVcbi8vIFRPRE86IGNsZWFudXAgdGhpcyBmaWxlLCBpdCdzIGNvcGllZCBhcyBpcyBmcm9tIEFuZ3VsYXIgQ0xJLlxuXG4vLyBFeHBvcnRzIHRoZSB3ZWJwYWNrIHBsdWdpbnMgd2UgdXNlIGludGVybmFsbHkuXG5leHBvcnQgeyBCYXNlSHJlZldlYnBhY2tQbHVnaW4gfSBmcm9tICcuLi9saWIvYmFzZS1ocmVmLXdlYnBhY2svYmFzZS1ocmVmLXdlYnBhY2stcGx1Z2luJztcbmV4cG9ydCB7IENsZWFuQ3NzV2VicGFja1BsdWdpbiwgQ2xlYW5Dc3NXZWJwYWNrUGx1Z2luT3B0aW9ucyB9IGZyb20gJy4vY2xlYW5jc3Mtd2VicGFjay1wbHVnaW4nO1xuZXhwb3J0IHsgQnVuZGxlQnVkZ2V0UGx1Z2luLCBCdW5kbGVCdWRnZXRQbHVnaW5PcHRpb25zIH0gZnJvbSAnLi9idW5kbGUtYnVkZ2V0JztcbmV4cG9ydCB7IFNjcmlwdHNXZWJwYWNrUGx1Z2luLCBTY3JpcHRzV2VicGFja1BsdWdpbk9wdGlvbnMgfSBmcm9tICcuL3NjcmlwdHMtd2VicGFjay1wbHVnaW4nO1xuZXhwb3J0IHsgU3VwcHJlc3NFeHRyYWN0ZWRUZXh0Q2h1bmtzV2VicGFja1BsdWdpbiB9IGZyb20gJy4vc3VwcHJlc3MtZW50cnktY2h1bmtzLXdlYnBhY2stcGx1Z2luJztcbmV4cG9ydCB7XG4gIGRlZmF1bHQgYXMgUG9zdGNzc0NsaVJlc291cmNlcyxcbiAgUG9zdGNzc0NsaVJlc291cmNlc09wdGlvbnMsXG59IGZyb20gJy4vcG9zdGNzcy1jbGktcmVzb3VyY2VzJztcblxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuZXhwb3J0IGNvbnN0IFJhd0Nzc0xvYWRlciA9IHJlcXVpcmUucmVzb2x2ZShqb2luKF9fZGlybmFtZSwgJ3Jhdy1jc3MtbG9hZGVyJykpO1xuIl19