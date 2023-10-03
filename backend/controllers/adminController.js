import asyncHandler from "express-async-handler";

const set404Page = asyncHandler(async (req, res) => {
  await req.db.fetch404PageHtml(req.body.text);
  res.send(200);
});

const get404page = asyncHandler(async (req, res,) => {
  const page = await req.db.get404PageHtml();
  res.send(page).status(200)
})

export { set404Page, get404page };
