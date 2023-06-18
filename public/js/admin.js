loadOrders();

async function loadOrders() {
    let response = await axios.get('/orders/all');
    orders = response.data;
    renderOrders(orders);
}

function renderOrders(orders) {
    let container = document.querySelector(`.orders`);

    container.innerHTML = ``;

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let status = order.status;

        let statusName;
        let color;
        if (status == 2) {
            statusName = 'В очереди';
            color = `status_2`
        } else if (status == 1) {
            statusName = 'В работе';
            color = `status_1`
        } else if (status == 3) {
            statusName = 'Завершено';
            color = `status_3`
        }
        container.innerHTML += `
        <div class="card my-3">
            <div class="card-body d-flex">
                <span class="ticket"> Талон # ${order.ticket}</span>
                <span class="title ms-2"> Окно № ${order.desk}</span>
                <button class="status btn ms-auto ${color}">${statusName}</button>  
            </div>
        </div>
        `;
    }
    let buttons = container.querySelectorAll(`.btn`);

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let button = buttons[i];

        button.addEventListener(`click`, async function () {
            let status = order.status;

            if (status == 2) {
                status = 1;
            } else if (status == 1) {
                status = 3;
            }

            await axios.post('/order/update', {
                id: order._id,
                status: status
            
            });
            loadOrders();
        });
    }
}
