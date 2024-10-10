
// [GET] localhost:/koi
module.exports.index = async (req, res) => {
  res.render("client/pages/home/index.pug", {
    pageTitle: res.locals.SettingGeneral.WebsiteName,
  });
};

// [GET] localhost:/koi/contact
module.exports.contact = async (req, res) => {
  res.render("client/pages/home/contact.pug", {
    pageTitle: "Trang liên hệ",
  });
};


// [GET] localhost:/koi/aboutUs
module.exports.aboutUs = async (req, res) => {
  res.render("client/pages/home/aboutUs.pug", {
    pageTitle: "Trang về chúng tôi",
  });
};


// [GET] localhost:/koi/news
module.exports.news = async (req, res) => {
  res.render("client/pages/home/news.pug", {
    pageTitle: "Trang tin tức",
  });
};

// [GET] localhost:/koi/community
module.exports.community = async (req, res) => {
  res.render("client/pages/home/community.pug", {
    pageTitle: "Trang cộng đồng",
  });
};

// [GET] localhost:/koi/envConsult
module.exports.envConsult = async (req, res) => {
  res.render("client/pages/home/envConsult.pug", {
    pageTitle: "Trang tư vấn môi trường",
  });
};

// [GET] localhost:/koi/onlConsult
module.exports.onlConsult = async (req, res) => {
  res.render("client/pages/home/onlConsult.pug", {
    pageTitle: "Trang tư vấn Online",
  });
};

// [GET] localhost:/koi/checkUp
module.exports.checkUp = async (req, res) => {
  res.render("client/pages/home/checkUp.pug", {
    pageTitle: "Trang khám bệnh",
  });
};
