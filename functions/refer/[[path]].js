export async function onRequest(context) {
  return await context.env.ASSETS.fetch(
    new URL("/referral-page/index.html", context.request.url)
  );
}
