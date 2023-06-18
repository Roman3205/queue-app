let express = require(`express`);
let app = express();
let port = 3004;

app.listen(port, function() {
    console.log(`http://localhost:${port}`);
})
app.use(express.static(`public`))
app.use(express.json())
let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/queue-app');

const hbs = require(`hbs`)
app.set('views', 'views');
app.set('view engine', 'hbs');

let ordersSchema = new mongoose.Schema({
    desk: Number,
    ticket: Number,
    status: Number
}, {
    timestamps: true
});

let Order = mongoose.model('orders', ordersSchema);


app.post('/order/create', async function(req, res) {
    let desk = req.body.desk;

    // добавил счет от последнего order
    let lastOrder = await Order.findOne({}).sort({ticket: -1})
    let ticket = 1
    if (lastOrder) {
        ticket = lastOrder.ticket + 1
    }


    let order = new Order({
        desk: desk,
        ticket: ticket, 
        status: 2
    });
    await order.save();
    res.send(order);
});


app.get(`/orders/all`, async function(req, res) {
    let orders = await Order.find({}).sort({ status: 1, desk: 1 })
    res.send(orders)
})

app.post(`/order/update`, async function(req,res) {
    let id = req.body.id
    let status = req.body.status

    let order = await Order.findOne({_id: id})
    order.status = status
    await order.save()
    res.send('ok');
})


app.get(`/orders/queue`, async function(req,res) {
    let orders = await Order.find({status: 1})
    res.send(orders)
})

app.get(`/admin`, function(req,res) {
    res.render(`admin`)
})

app.get(`/`, function(req,res) {
    res.render(`index`)
})