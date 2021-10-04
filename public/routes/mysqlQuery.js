var con = require('../../database');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const randomNumber = require("random-number-csprng");
const saltRounds = 10;

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


module.exports = {
    beLoggedIn: async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        let query = "SELECT password FROM `admins` WHERE email = '" + email + "' ";
        let productsQuery = "SELECT * FROM `products`";

        con.query(query, async (err, result) => {
            if (err) {
                res.redirect('/login');
            }

            if (result[0]) {

                let isSamePassword = await bcrypt.compare(password, result[0].password).then(async function (result) {
                    const prefix = "t.";
                    const rndNumber = await randomNumber(100000, 999999);
                    const token =  Math.random().toString(36).substring(7) + rndNumber.toString() + Date.now();
                    const uuid = email.substring(0,1) + "pte" + email.substring(-1,1);
                    req.session.userTkn = (prefix + rndNumber + uuid + token);

                    return result;
                });

                if (isSamePassword) {
                    con.query(productsQuery, (err, pResult) => {
                        if (err) {
                            res.redirect('/login');
                        }
                        res.redirect('/panel');
                    });
                } else {
                    res.render('./pages/login', {
                        authWarn: "Kullanıcı adı veya şifre yanlış! Lütfen tekrar deneyiniz.",
                    })
                }
            } else {
                res.render('./pages/login', {
                    authWarn: "Kullanıcı adı veya şifre yanlış! Lütfen tekrar deneyiniz.",
                })
            }
        });
        //    console.log("req: ",req);
    },

    getProducts: (req, res) => {
        let query = "SELECT * FROM `products`";

        con.query(query, (err, result) => {
            if (err) {
                res.redirect('/panel');
            }
            res.render('./pages/index', data = {
                products: result
            });
        });
    },

    frontendPage: (req, res) => {
        let query = "SELECT * FROM `products` WHERE status = 1";

        con.query(query, (err, result) => {
            if (err) {
                res.redirect('/panel');
            }
            res.render('./pages/frontend', data = {
                products: result
            });
        });
    },

    productAddPage: (req, res) => {
        res.render('./pages/productAddPage');
    },

    addProduct: (req, res) => {
        let uploadadImage;
        upload(req, res, (err) => {
            if (err) {
                res.render('./pages/productAddPage', {
                    msg: err
                });
            } else {
                uploadadImage = req.file;
                console.log(req.body);
                if (req.file == undefined) {
                    res.render('./pages/productAddPage', {
                        msg: 'Error: No File Selected!'
                    });
                } else {
                    let status;
                    if (req.body.status == "on") {
                        status = 1;
                    } else {
                        status = 0;
                    }
                    let query = "INSERT INTO `products` (productName, productImage, status,productLink) VALUES ('" + req.body.name + "','" + uploadadImage.filename + "',CAST('" + status + "' AS UNSIGNED),'" + req.body.link + "')";
                    con.query(query, (err, result) => {
                        if (err) {
                            // res.render('./pages/productAddPage', {
                            //     msg: err
                            // });
                            return res.status(500).send(err);
                        }

                        res.redirect('/panel');
                    });
                }
            }
        });
    },

    productUpdatePage: (req, res) => {

        let query = "SELECT * FROM `products` WHERE id = '" + req.params.id + "' ";

        con.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('./pages/productUpdatePage', data = {
                product: result
            });
        });
    },

    updateProduct: (req, res) => {
        let uploadadImage;
        upload(req, res, (err) => {
            if (err) {
                console.log("hata", err);
                res.render('./pages/productUpdatePage', {
                    msg: err
                });
            } else {
                let status;
                if (req.body.status == "on") {
                    status = 1;
                } else {
                    status = 0;
                }
                uploadadImage = req.file;
                // console.log(req.file);
                // console.log(req.body.name);
                if (req.file == undefined) {
                    let oldImage = "SELECT productImage FROM `products` WHERE id = '" + req.params.id + "' ";

                    con.query(oldImage, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        let uploadadImageFileName = result[0].productImage;

                        let productId = req.params.id;
                        let productName = req.body.name;
                        let productLink = req.body.link;
                        // let status = req.body.status;

                        let query = "UPDATE `products` SET `productName` = '" + productName + "', `productImage` = '" + uploadadImageFileName + "', `productLink` = '" + productLink + "', `status` = CAST('" + status + "' AS UNSIGNED) WHERE `products`.`id` = '" + productId + "'";
                        con.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/panel');
                        });


                    });
                } else {
                    let status;
                    if (req.body.status == "on") {
                        status = 1;
                    } else {
                        status = 0;
                    }

                    let productId = req.params.id;
                    let productName = req.body.name;
                    let productLink = req.body.link;
                    // let status = req.body.status;

                    let query = "UPDATE `products` SET `productName` = '" + productName + "', `productImage` = '" + uploadadImage.filename + "', `productLink` = '" + productLink + "', `status` = CAST('" + status + "' AS UNSIGNED) WHERE `products`.`id` = '" + productId + "'";
                    con.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/panel');
                    });
                }
            }
        });
    },

    deleteProduct(req, res) {
        let query = "DELETE FROM `products` WHERE id = '" + req.body.id + "' ";

        con.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
        });
    },

    searchProduct(req, res) {

        console.log("body",req.body)

        let query = "Select * FROM `products` WHERE productName like  '%" + req.body.searchedName + "%' ";
        con.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('./pages/frontend', data = {
                products: result
            });
        });
        },

        clearSearchProduct(req, res) {
    
            let query = "Select * FROM `products` WHERE productName like  '%" + "" + "%' ";
            con.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/')
            });
            },

    addNewAdmin: async (req, res) => {
        let password = req.body.password;
        let hashedPassword = await bcrypt.hash(password, saltRounds).then(function (hash) {
            return hash;
        });
        let query = "INSERT INTO `admins` (name,email,password) VALUES ('" + req.body.name + "','" + req.body.email + "','" + hashedPassword + "')";
        con.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('./pages/settings',{
                responseInfo2: "Yeni admin başarılı şekilde eklendi."
            });
        });

    },

    updateAdminPassword: async (req, res) => {
        let email = req.body.email;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        let query = "SELECT password FROM `admins` WHERE email = '" + email + "' ";


        con.query(query, async (err, result) => {
            if (err) {
                res.redirect('/settings');
            }

            if (result[0]) {

                let isSamePassword = await bcrypt.compare(oldPassword, result[0].password).then(function (result) {
                    return result;
                });

                if (isSamePassword) {
                    let hashedPassword = await bcrypt.hash(newPassword, saltRounds).then(function (hash) {
                        return hash;
                    });
                    let updateQuery = "UPDATE `admins` set password = '" + hashedPassword + "' where email = '" + email + "' "

                    con.query(updateQuery, (err, updateAdminResult) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.render('./pages/settings',{
                            responseInfo1: "Şifreniz başarılı şekilde güncellendi."
                        });
                    })

                } else {
                    console.log("Şifreler uyumlu değil!");
                    res.redirect('/settings');
                }
            } else {
                res.render('./pages/settings',{
                    warnInfo:"Bu verilere sahip bir kullanıcı bulunamadı!"
                });
            }
        });




    },

};
