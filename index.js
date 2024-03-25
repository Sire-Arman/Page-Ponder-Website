import Express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const port = 3000;
const app = Express();
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "bookhandler",
  password: "870742@aA",
  post: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static("public"));

let books = [];
app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "select * from users join books on book_id = books.id"
    );
    // console.log(result.rows)
    books = result.rows;
    res.render("index.ejs",{
        books: books
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async(req,res)=>{
   try {
    const title = req.body.title;
    const author = req.body.author
    const rating = req.body.rating;
    const desc = req.body.description;
    const rest = await db.query("insert into books (author, title) values ($1,$2) returning *", [author, title]);
    const id = rest.rows[0].id;
    // console.log(result);
    const resa = await db.query("insert into users (book_id, description, rating) values ($1, $2, $3)", [id,desc,rating]);
    console.log("added succesfully");
    res.redirect("/");
   } catch (error) {
    console.log(error)
   }
}); 
app.post("/delete", async (req, res) => {
    try {
      // console.log(req.body);
    let id = req.body.deleteItemId;
    const result = await db.query("delete from items where id = $1", [id])
    res.redirect("/");
    } catch (error) {
      console.log(error)
    }
  });

app.listen(port, () => {
  console.log(`App running successfully on port:${port}`);
});
