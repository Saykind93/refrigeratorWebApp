const router = require('express').Router();

const { Category } = require('../db/models');
const { Product } = require('../db/models');
const { UserProduct } = require('../db/models');


router.route('/')
.get(async (req, res) => {
  const allProducts = await Product.findAll({include: Category}, {plain: true})
  res.render('index', {allProducts})
});

router.route('/newProd')
.get(async (req, res) => {
  const allCat = await Category.findAll()
  res.render('newproductform', {allCat})
})
.post(async (req, res) => {
  const newProd = await Product.create({Name:req.body.title, category_id:req.body.category_id })
  const  newUserProd = await UserProduct.create({user_id:req.session.user.id, product_id:newProd.dataValues.id})
  res.redirect('/')
});



module.exports = router;
