const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("cadastro")
})

app.post("/", function(req, res){
    post.create({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado: req.body.estado,
        telefone: req.body.telefone
    }).then(function(){
        console.log("Cadastrado com sucesso");
    }).catch(function(erro){    
        console.log("Erro ao cadastrar: ", erro);
        res.send("Erro: " + erro)
    })
});


app.get("/consulta", function(req, res) {
    post.findAll().then(function(posts) {
        const formattedPosts = posts.map(post => post.get({ plain: true })); // Transformar em objeto simples
        console.log(formattedPosts); // Veja os dados formatados
        res.render("consulta", { posts: formattedPosts });
    }).catch(function(erro) {
        console.log("Erro ao carregar dados do banco: " + erro);
        res.status(500).send("Erro ao carregar dados do banco."); // Opcional: enviar uma resposta ao cliente
    });
});

app.get("/editar/:id", function(req, res) {
    post.findOne({ where: { id: req.params.id } })
        .then(function(post) {
            if (post) {
                res.render("editar", { post }); // Passa apenas um post, não um array
                console.log(post);
            } else {
                res.status(404).send("Post não encontrado.");
            }
        })
        .catch(function(erro) {
            console.log("Erro ao carregar dados do banco: " + erro);
            res.send("Erro ao carregar dados do banco: " + erro);
        });
});

    
app.post("/editar", function(req, res) {
    const id = req.body.id; // Verifique se o ID está sendo capturado corretamente

    post.update({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado: req.body.estado,
        telefone: req.body.telefone,
    }, { where: { id: id } }) // Use a variável id
    .then(function() {
        res.redirect("/consulta");
    })
    .catch(function(erro) {
        console.log("Erro ao atualizar: " + erro);
        res.send("Erro ao atualizar: " + erro);
    });
});


app.get("/excluir/:id", function(req, res){
    post.destroy({where: {"id": req.params.id}}).then(function(){
        res.redirect("/consulta")
    }).catch(function(erro){
        res.send("Erro ao deletar: " + erro)
    })
})

app.listen(8088, function(){
    console.log("Servidor Ativo!")
})