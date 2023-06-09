export function router(app) {
    app.get("/", (req, res) => {
        res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
        res.status(200).render("index");
    });
}
