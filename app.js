const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');
const hbs = require('hbs');
//для добавления фото
const fileUpload = require('express-fileupload');

//session
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient()

// Импортируем созданный в отдельный файлах рутеры.
const indexRouter = require('./routes/index');
// const entriesRouter = require('./routes/entries');
 const userRouter = require('./routes/userRouter');


const app = express();
const PORT = 3000;




// Сообщаем express, что в качестве шаблонизатора используется "hbs".
app.set('view engine', 'hbs');
// Сообщаем express, что шаблона шаблонизаторая (вью) находятся в папке "ПапкаПроекта/views".
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');

//helpers
hbs.registerHelper("userCheck", (user, userPostId) => {
  if(!user){
    return false
  }
  if(user.id == userPostId){
      return true
  }
})

//session middleware
app.use(
  session({
    name:'sId',
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: 'gdfgdfgdfgdfg',
    resave: false,
  })
)

app.use( (req, res, next) => {
  res.locals.user = req?.session?.user
  console.log('-----------тест----->', req.session.user);
  return next()
})



// Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(logger('dev'));
// Подключаем middleware, которое сообщает epxress, что в папке "ПапкаПроекта/public" будут находится статические файлы, т.е. файлы доступные для скачивания из других приложений.
app.use(express.static(path.join(__dirname, 'public')));
// Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));
// Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые в формате JSON в body HTTP-запроса.
app.use(express.json());


app.use('/', indexRouter);
app.use('/user', userRouter)

// app.use( (req, res, next) => {
//   if(req.session.user){next()}
//   else{res.redirect('/user/signIn')}
// })

app.use((req, res, next) => {
  const error = createError(404, 'Запрашиваемой страницы не существует на сервере.');
  next(error);
});

// Отлавливаем HTTP-запрос с ошибкой и отправляем на него ответ.
app.use(function (err, req, res, next) {
  // Получаем текущий ражим работы приложения.
  const appMode = req.app.get('env');
  // Создаём объект, в котором будет храниться ошибка.
  let error;

  // Если мы находимся в режиме разработки, то отправим в ответе настоящую ошибку. В противно случае отправим пустой объект.
  if (appMode === 'development') {
    error = err;
  } else {
    error = {};
  }

  // Записываем информацию об ошибке и сам объект ошибки в специальные переменные, доступные на сервере глобально, но только в рамках одного HTTP-запроса.
  res.locals.message = err.message;
  res.locals.error = error;

  // Задаём в будущем ответе статус ошибки. Берём его из объекта ошибки, если он там есть. В противно случае записываем универсальный стату ошибки на сервере - 500.
  res.status(err.status || 500);
  // Формируем HTML-текст из шаблона "error.hbs" и отправляем его на клиент в качестве ответа.
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}}`);
})
