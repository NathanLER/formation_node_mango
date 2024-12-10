// Importer les modules
const express = require('express');
const mongoose = require('mongoose');

// quand je suis connecter a la bdd
mongoose.connection.once('open', () => {
    console.log('Connecter à la bdd')
});

mongoose.connection.on('error' , () => {
    console.log('Erreur dans la bdd')
});

//se connecter a la base
mongoose.connect("mongodb://localhost:27017/db_demo");
const Article = mongoose.model('Article' , {name : String}, 'articles');
const app = express();
app.use(express.json());





app.get('/articles' , async (request, response) => {
    const articles = await Article.find();
    if (articles.length == 0) {
        return articles.json({code : "701"})
    }   
    return response.json(articles);
});






app.get('/article/:id' , async (request, response) => {
    const idParam = request.params.id;
    const foundArticle = await Article.findOne({'_id': idParam});
    if (!foundArticle){
        return response.json({code:"705"});
    }
    return response.json(foundArticle);
});





app.post("/save-article", async (request, response) => {
    let articlesJson = request.body;
    if ("id" in request.body) {
        const id = request.body["id"]
        articlesJson = Object.fromEntries(
            Object.entries(articlesJson).filter(([key]) => key !== id)
            );
        if (id.length==24){
            const foundArticle =  await Article.findById(id);
            if (foundArticle) {
                
                const articleUpdate = await Article.findByIdAndUpdate(id, articlesJson, { new: true , runValidators: true });
                return response.json(articleUpdate)
            }}}
    const article = Article(articlesJson);
    await article.save()
    return response.json(article);
});





app.delete("/delete-article/:id", async (request, response) => {
    const idParam = request.params.id;
    Article.findByIdAndDelete(idParam) // Remplacez par un ID réel
    .then((result) => {
      if (result) {
        console.log("Utilisateur supprimé :", result);
      } else {
        console.log("Utilisateur introuvable.");
      }
    })
    .catch((err) => {
      console.error("Erreur lors de la suppression :", err);
    });


    return response.json({code : 200})
})




// lancer le sevreur
app.listen(3000,() => {
    console.log('server on');
});
