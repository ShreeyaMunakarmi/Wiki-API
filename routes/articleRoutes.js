const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

// Routes for all articles
router.route("/")
  .get(articleController.getAllArticles)          // GET all articles
  .post(articleController.createArticle)          // POST a new article
  .delete(articleController.deleteAllArticles)    // DELETE all articles for the logged-in user

  router.get("/admin/allarticles", articleController.getArticlesForAdmin);

// Routes for a specific article by title
router.route("/:articleTitle")
  .get(articleController.getArticle)              // GET a specific article by title
  .put(articleController.updateArticle)           // PUT to replace an article by title
  .patch(articleController.patchArticle)          // PATCH to update an article by title
  .delete(articleController.deleteArticle);       // DELETE a specific article by title

module.exports = router;
