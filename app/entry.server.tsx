import { PassThrough } from "stream";
import { Response } from "@remix-run/node";
import isbot from "isbot";

import { renderToPipeableStream } from "react-dom/server";
import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { injectStyles, createStylesServer } from "@mantine/remix";

const ABORT_DELAY = 5000;

const server = createStylesServer();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          let markup = renderToString(
            <RemixServer context={remixContext} url={request.url} />
          );

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(`<!DOCTYPE html>${injectStyles(markup, server)}`, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );

          pipe(body);
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
