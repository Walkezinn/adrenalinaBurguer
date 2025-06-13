const { Order, OrderItem, Product, User, Address, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createOrder = async (req, res) => {
  const { items, address_id } = req.body;
  const user_id = req.user.id;
  const t = await sequelize.transaction();
  try {
    const productIds = items.map(item => item.id);
    const products = await Product.findAll({ where: { id: productIds } }, { transaction: t });

    let totalPrice = 0;
    const orderItemsData = items.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) throw new Error(`Produto com ID ${item.id} não encontrado.`);
      if (!product.is_available) throw new Error(`Produto ${product.name} não está disponível.`);
      totalPrice += product.price * item.quantity;
      return {
        product_id: item.id,
        quantity: item.quantity,
        unit_price: product.price,
      };
    });

    const order = await Order.create({
      user_id,
      address_id,
      total_price: totalPrice,
      status: 'recebido',
    }, { transaction: t });

    await Promise.all(orderItemsData.map(itemData =>
        OrderItem.create({ order_id: order.id, ...itemData }, { transaction: t })
    ));

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: { user_id: req.user.id },
        include: [
            { model: OrderItem, as: 'Items', include: [Product] },
            { model: Address, as: 'DeliveryAddress' }
        ],
        order: [['created_at', 'DESC']]
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, as: 'Customer', attributes: ['name', 'email'] },
                { model: Address, as: 'DeliveryAddress' }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar todos os pedidos.', error: error.message });
    }
};

exports.getAvailableOrders = async (req, res) => {
    try {
        const availableOrders = await Order.findAll({
            where: { status: 'pronto_para_entrega' },
            include: [
                { model: User, as: 'Customer', attributes: ['name'] },
                { model: Address, as: 'DeliveryAddress' }
            ],
            order: [['created_at', 'ASC']]
        });
        res.status(200).json(availableOrders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar entregas disponíveis', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) return res.status(404).json({ message: "Pedido não encontrado." });

        const user = req.user;

        // Regras de permissão
        if (user.role === 'cliente') {
            return res.status(403).json({ message: "Clientes não podem alterar o status do pedido."});
        }
        if(user.role === 'entregador' && !['em_rota', 'entregue'].includes(status)) {
            return res.status(403).json({ message: "Entregador só pode alterar o status para 'em rota' ou 'entregue'."});
        }
        if(user.role === 'entregador' && status === 'em_rota' && order.status !== 'pronto_para_entrega') {
            return res.status(403).json({ message: "Este pedido não está pronto para entrega."});
        }

        order.status = status;
        if (status === 'em_rota' && user.role === 'entregador') {
            order.delivery_person_id = user.id;
        }

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status do pedido', error: error.message });
    }
};