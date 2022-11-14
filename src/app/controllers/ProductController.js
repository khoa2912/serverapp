const Product = require('../models/Product')
const shortid = require('shortid')
const slugify = require('slugify')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const { json } = require('express')
const ObjectId = require('mongodb').ObjectID
const mongoose = require('mongoose')
const encodeBase64 = (data) => {
    return Buffer.from(data).toString('base64')
}
const NodeCache = require('node-cache')
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })
var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'shoplaptop',
    api_key: '672421112872878',
    api_secret: 'zmqOX3J_4CliR5GifTptxoceHro',
    secure: true,
})
mongoose.Promise = global.Promise
function generateSortOptions(sortFields, sortAscending = true) {
    const sort = {}
    const sortType = sortAscending === 'asc' ? 1 : -1
    return new Promise((resolve) => {
        if (!!sortFields && sortFields.length > 0) {
            switch (sortFields) {
                case 'createdAt': {
                    sort.createdAt = sortType
                    break
                }
                case 'salePrice': {
                    sort.salePrice = sortType
                    break
                }
                case 'salePrice': {
                    sort.salePrice = sortType
                    break
                }
                case 'Product_Mass': {
                    sort.Product_Mass = sortType
                    break
                }
                case 'Product_Name': {
                    sort.Product_Name = sortType
                    break
                }
                case 'Product_Category': {
                    sort.Product_Category = sortType
                    break
                }
                case 'Product_Group': {
                    sort.Product_Group = sortType
                    break
                }
                case 'Product_Unit': {
                    sort.Product_Unit = sortType
                    break
                }
                case 'Product_Supplier': {
                    sort.Product_Supplier = sortType
                    break
                }
                case 'Product_Minstock': {
                    sort.Product_Minstock = sortType
                    break
                }
                case 'Product_Dimension': {
                    sort.Product_Dimension = sortType
                    break
                }
                case 'Product_Sellprice': {
                    sort.Product_Sellprice = sortType
                    break
                }
                case 'Product_Stockprice': {
                    sort.Product_Stockprice = sortType
                    break
                }
                case 'Product_Description': {
                    sort.Product_Description = sortType
                    break
                }
                case 'Product_Original': {
                    sort.Product_Original = sortType
                    break
                }
                case 'Status': {
                    sort.Status = sortType
                    break
                }
                case 'CreatedBy': {
                    sort.CreatedBy = sortType
                    break
                }
                case 'CreatedDate': {
                    sort.CreatedDate = sortType
                    break
                }
                case 'UpdatedBy': {
                    sort.UpdatedBy = sortType
                    break
                }
                case 'UpdatedDate': {
                    sort.UpdatedDate = sortType
                    break
                }
                default:
                    break
            }

            resolve(sort)
        } else {
            resolve({})
        }
    })
}
class ProductController {
    async create(req, res, next) {
        if (req.actions.includes('Them-san-pham')) {
            var productPicture = []
            if (req.body.productPicture.length > 0) {
                productPicture = await req.body.productPicture.map((item) => {
                    return { img: item }
                })
            }

            let cpu = [
                {
                    cpuId: req.body.cpuId,
                    name: req.body.nameCpu,
                    type: req.body.typeCpu,
                },
            ]

            let color = [
                {
                    colorId: req.body.colorId,
                    name: req.body.nameColor,
                    type: req.body.typeColor,
                },
            ]

            let ram = [
                {
                    ramId: req.body.ramId,
                    name: req.body.nameRam,
                    type: req.body.typeRam,
                },
            ]

            let manhinh = [
                {
                    screenId: req.body.screenId,
                    name: req.body.nameScreen,
                    type: req.body.typeScreen,
                },
            ]

            let descriptionTable = [
                {
                    baohanh: req.body.timeBaoHanh,
                    Series: req.body.series,
                    color: color,
                    cpu: cpu,
                    cardDohoa: req.body.card,
                    ram: ram,
                    manhinh: manhinh,
                    ocung: req.body.ocung,
                    hedieuhanh: req.body.hedieuhanh,
                    khoiluong: req.body.khoiluong,
                },
            ]
            const product = new Product({
                name: req.body.name,
                slug: slugify(req.body.name),
                regularPrice: req.body.regularPrice,
                salePrice: req.body.salePrice,
                quantity: req.body.quantity,
                description: req.body.description,
                descriptionTable: descriptionTable,
                productPicture,
                tag: req.body.listTag,
                category: req.body.categoryId,
                createdBy: req.user.id,
            })
            product.save((error, product) => {
                if (error) return res.status(400).json({ error })
                if (product) {
                    res.status(201).json({ product })
                }
            })
        } else {
            // console.log('Khong du quyen')
            return res.status(403).send('Khongduquyen')
        }
    }

    // async updateProduct(req, res, next) {
    // var productPicture = []
    // if (req.files.length > 0) {
    //     productPicture = req.files.map((file) => {
    //         return { img: file.filename }
    //     })
    // }
    //     let descriptionTable = [
    //         {
    //             baohanh: req.body.timeBaoHanh,
    //             Series: req.body.series,
    //             color: req.body.color,
    //             cpu: req.body.cpu,
    //             cardDohoa: req.body.card,
    //             ram: req.body.ram,
    //             manhinh: req.body.manhinh,
    //             ocung: req.body.ocung,
    //             hedieuhanh: req.body.hedieuhanh,
    //             khoiluong: req.body.khoiluong,
    //         },
    //     ]
    //     Product.findOneAndUpdate(
    //         { _id: req.body.id },
    //         {
    //             $set: {
    //                 name: req.body.name,
    //                 regularPrice: req.body.regularPrice,
    //                 salePrice: req.body.salePrice,
    //                 quantity: req.body.quantity,
    //                 productPicture: req.body.productPicture,
    //                 description: req.body.description,
    //                 descriptionTable: descriptionTable,
    //                 category: req.body.categoryId,
    //             },
    //         },
    //         { new: true, upsert: true }
    //     ).exec((error, product) => {
    //         console.log(error)
    //         if (error) return res.status(400).json({ error })
    //         if (product) {
    //             res.status(201).json({ product })
    //         }
    //     })
    // }

    updateProduct = async (req, res) => {
        var productPicture = []
        var listPictureUpload = []
        var listPicture = []
        req.body.productPicture.map((item) => {
            if (item.img) {
                listPicture.push(item.img)
            } else {
                listPictureUpload.push(item)
            }
        })
        productPicture = listPictureUpload.concat(listPicture)
        if (req.body.productPicture.length > 0) {
            productPicture = productPicture.map((item) => {
                return { img: item }
            })
        }
        let cpu = [
            {
                cpuId: req.body.cpuId,
                name: req.body.nameCpu,
                type: req.body.typeCpu,
            },
        ]

        let color = [
            {
                colorId: req.body.colorId,
                name: req.body.nameColor,
                type: req.body.typeColor,
            },
        ]

        let ram = [
            {
                ramId: req.body.ramId,
                name: req.body.nameRam,
                type: req.body.typeRam,
            },
        ]

        let manhinh = [
            {
                screenId: req.body.screenId,
                name: req.body.nameScreen,
                type: req.body.typeScreen,
            },
        ]

        let descriptionTable = [
            {
                baohanh: req.body.timeBaoHanh,
                Series: req.body.series,
                color: color,
                cpu: cpu,
                cardDohoa: req.body.card,
                ram: ram,
                manhinh: manhinh,
                ocung: req.body.ocung,
                hedieuhanh: req.body.hedieuhanh,
                khoiluong: req.body.khoiluong,
            },
        ]
        Product.findOne({ _id: req.body._id }, function (err, obj) {
            Product.updateOne(
                {
                    _id: req.body._id,
                },
                {
                    $set: {
                        name: req.body.name,
                        slug: slugify(req.body.name),
                        regularPrice: req.body.regularPrice,
                        salePrice: req.body.salePrice,
                        quantity: req.body.quantity,
                        productPicture,
                        tag: req.body.listTag,
                        description: req.body.description,
                        descriptionTable: descriptionTable,
                        category: req.body.categoryId,
                    },
                }
            ).exec((error, product) => {
                if (error) return res.status(400).json({ error })
                if (product) {
                    res.status(201).json({ product })
                }
            })
        })
    }

    getProductRelated = async (req, res) => {
        try {
            const products = await Product.find({
                category: req.body.categoryId,
                _id: { $nin: [req.body.productId] },
            })
                .populate({ path: 'tag' })
                .populate({ path: 'category', select: '_id name' })
                .select('-description')
                .exec()
            res.status(200).json({ products })
        } catch (error) {
            console.log(error)
        }
    }

    getProductByTag(req, res, next) {
        const { tag } = req.params
        Tag.findOne({ tag: tag })
            .select('_id nameTag')
            .exec((error, tag) => {
                if (error) {
                    return res.status(400).json({ error })
                }
                if (tag) {
                    Product.find({ tag: tag._id }).exec((error, products) => {
                        if (error) {
                            return res.status(400).json({ error })
                        }

                        if (tag.tagName) {
                            if (products.length > 0) {
                                res.status(200).json({
                                    tag,
                                    products,
                                })
                            }
                        } else {
                            res.status(200).json({ products })
                        }
                    })
                }
            })
    }

    getProductBySlug(req, res, next) {
        const { slug } = req.params
        Category.findOne({ slug: slug })
            .select('_id type categoryImage')
            .exec((error, category) => {
                if (error) {
                    return res.status(400).json({ error })
                }
                if (category) {
                    Product.find({ category: category._id }).exec(
                        (error, products) => {
                            if (error) {
                                return res.status(400).json({ error })
                            }

                            if (category.type) {
                                if (products.length > 0) {
                                    res.status(200).json({
                                        category,
                                        products,
                                    })
                                }
                            } else {
                                res.status(200).json({ products })
                            }
                        }
                    )
                }
            })
    }
    getProductDetailsById = (req, res) => {
        const { productId } = req.params
        try {
            Product.findOne({ _id: productId }, function (err, obj) {
                Product.updateOne(
                    {
                        _id: productId,
                    },
                    {
                        $set: {
                            view: obj?.view + 1,
                        },
                    }
                ).exec((error, product) => {
                    if (error) return res.status(400).json({ error })
                    if (product) {
                        Product.findOne(
                            { _id: productId },
                            function (err, obj) {
                                res.status(201).json({ product: obj })
                            }
                        )
                        // res.status(201).json({ product })
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    deleteProductById = (req, res) => {
        console.log(req.actions)
        if (req.actions.includes('Xoa-san-pham')) {
            const { productId } = req.body.payload
            if (productId) {
                Product.deleteMany({ _id: productId }).exec((error, result) => {
                    if (error) return res.status(400).json({ error })
                    if (result) {
                        res.status(202).json({ result })
                    }
                })
            } else {
                res.status(400).json({ error: 'Params required' })
            }
        } else {
            return res.status(403).send('Khongduquyen')
        }
    }

    getProducts = async (req, res) => {
        try {
            const products = await Product.find({})
                .populate({ path: 'tag' })
                .populate({ path: 'category', select: '_id name' })
                .select('-description')
                .exec()
            res.status(200).json({ products })
        } catch (error) {
            console.log(error)
        }
    }
    uploadPicture = async (req, res, next) => {
        try {
            const fileStr = req.body.data
            const productPicture = await fileStr.map(async (item) => {
                const uploadResponse = await cloudinary.uploader.upload(item)
                return uploadResponse.url
            })
            Promise.all(productPicture).then((result) => {
                res.json({ result })
            })
        } catch (err) {
            console.log(err)
        }
    }
    search = async function (req, res) {
        const query = { descriptionTable: { $elemMatch: {} } }
        const {
            q,
            sortOption,
            categoryId,
            ram,
            cpu,
            manhinh,
            minPrice,
            maxPrice,
            tagid,
        } = req.body.data.payload

        const sort = await generateSortOptions(
            sortOption.sortBy,
            sortOption.sortOrder
        )
        const options = {
            sort,
            limit: 99,
            lean: true,
            select:'-description'
        }

        if (!!q) {
            query.name = {
                $regex: new RegExp(q, 'i'),
            }
        }
        if (!!minPrice) {
            query.salePrice = { $gte: minPrice }
        }
        if (!!maxPrice) {
            query.salePrice = { $lte: maxPrice }
        }
        if (!!ram && ram.length !== 0) {
            Object.assign(query.descriptionTable['$elemMatch'], {
                ram: { $elemMatch: { ramId: { $in: ram } } },
            })
        }
        if (!!cpu && cpu.length !== 0) {
            Object.assign(query.descriptionTable['$elemMatch'], {
                cpu: { $elemMatch: { cpuId: { $in: cpu } } },
            })
        }
        if (!!tagid) {
            query.tag = { $in: tagid }
        }
        if (!!manhinh && manhinh.length !== 0) {
            Object.assign(query.descriptionTable['$elemMatch'], {
                manhinh: { $elemMatch: { screenId: { $in: manhinh } } },
            })
        }
        if (!!categoryId && categoryId.length > 0) {
            query.category = { $in: categoryId }
        }
        Product.paginate({ $and: [query] }, options).then(function (result) {
            return res.json({
                returnCode: 1,
                result,
            })
        })
    }
    getDataFilter = async (req, res, next) => {
        const options = {
            limit: 99,
            lean: true,
            populate: [
                {
                    path: 'category',
                    select: '_id name',
                },
            ],
            select:'-description'
        }
        console.log(req.body)
        const searchModel = req.body
        const query = {}
        if (
            !!searchModel.ProductName &&
            Array.isArray(searchModel.ProductName) &&
            searchModel.ProductName.length > 0
        ) {
            query._id = { $in: searchModel.ProductName }
        }

        if (
            !!searchModel.CategoryId &&
            Array.isArray(searchModel.CategoryId) &&
            searchModel.CategoryId.length > 0
        ) {
            query.category = { $in: searchModel.CategoryId }
        }

        if (
            !!searchModel.Product_Tag &&
            Array.isArray(searchModel.Product_Tag) &&
            searchModel.Product_Tag.length > 0
        ) {
            query.tag = { $elemMatch: { $in: searchModel.Product_Tag } }
        }

        // if (
        //     !!searchModel.Ram &&
        //     Array.isArray(searchModel.Ram) &&
        //     searchModel.Ram.length > 0
        // ) {
        //     query.ram = { $elemMatch: { name: searchModel.Ram}}
        // }

        Product.paginate({ $and: [query] }, options).then(function (result) {
            return res.json({
                result,
            })
        })
    }
    async getAllProducts(req, res, next) {
        const allProducts = await Product.find({})
            .populate({
                path: 'category',
                select: '_id name',
            })
            .populate({ path: 'tag' })
        if (allProducts) {
            res.status(200).json({ allProducts })
        }
    }
    searchProducts = async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Headers', '*')
        res.header('Access-Control-Allow-Credentials', true)
        const { q, sortOrder, sortBy, categoryId } = req.body.data.payload
        const listQuery = []
        if (q !== '') {
            const searchName = q
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`)
            const searchNameRgx = rgx(searchName)

            if (categoryId) {
                const searchQuery = {
                    $match: {
                        name: { $regex: searchNameRgx, $options: 'i' },
                        category: ObjectId(categoryId),
                    },
                }
                listQuery.push(searchQuery)
            } else {
                const searchQuery = {
                    $match: { name: { $regex: searchNameRgx, $options: 'i' } },
                }
                listQuery.push(searchQuery)
            }
        }
        /*  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchNameRgx = rgx(stringQuery); */
        /* const products = await Product.find({
      name: { $regex: searchNameRgx, $options: "i" },
    }); */
        if (sortBy) {
            const order = sortOrder === 'asc' ? 1 : -1
            listQuery.push({ $sort: { [sortBy]: order } })
        }
        /* if (categoryId) {
      const singeQuery = {
        $match: {
         category:categoryId
        },
      };
      listQuery.push(singeQuery);
    } */

        /*  if (sortBy) {
      const order = sortOrder === "asc" ? 1 : -1;
      listQuery.push({ $sort: { [sortBy]: order } });
    }  */

        /* const rangeFilter = "..";
    const collectionFilter = ",";
    for (const filter in filters) {
      const element = filters[filter];

      if (element.indexOf(rangeFilter) !== -1) {
        const max = 99999999999999;
        const min = 0;
        const fromToRawInput = element.split(rangeFilter);

        const selectValueAndRemoveUnit = (input) => {
          let endOfValue = 0;

          if (input.match(/[^0-9]/)) {
            endOfValue = input.match(/[^0-9]/).index;
            return input.slice(0, endOfValue);
          } else {
            return input;
          }
        };

        const fromTo = fromToRawInput.map(selectValueAndRemoveUnit);

        const from = fromTo[0] === "" ? min : parseFloat(fromTo[0]);
        const to = fromTo[1] === "" ? max : parseFloat(fromTo[1]);

        const rangeQuery = {
          $match: {
            $or: [
              { [filter]: { $gte: from, $lte: to } },
              {
                categoryInfo: {
                  $elemMatch: { name: filter, value: { $gte: from, $lte: to } },
                },
              },
            ],
          },
        };

        listQuery.push(rangeQuery);
      } else {
        if (element.indexOf(collectionFilter) !== -1) {
          const collections = element.split(collectionFilter);

          const collectionQuery = {
            $match: {
              $or: [
                { [filter]: { $in: collections } },
                {
                  categoryInfo: {
                    $elemMatch: { name: filter, value: { $in: collections } },
                  },
                },
              ],
            },
          };

          listQuery.push(collectionQuery);
        } else {
          const singeQuery = {
            $match: {
              $or: [
                { [filter]: element },
                {
                  categoryInfo: {
                    $elemMatch: { name: filter, value: element },
                  },
                },
              ],
            },
          };

          listQuery.push(singeQuery);
        }
      }
    } */

        try {
            const productsFilter = await Product.aggregate(listQuery).exec()
            if (productsFilter) {
                res.status(200).json({ productsSearch: productsFilter })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new ProductController()
