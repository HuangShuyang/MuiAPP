
		mui(".mui-content").on("tap", "#head-img", function() {
//			调用原生的操作表
			if (mui.os.plus) {
				var a = [{
					title: "拍照"
				}, {
					title: "从手机相册选择"
				}];
				plus.nativeUI.actionSheet({
					title: "修改头像",
					cancel: "取消",
					buttons: a
				}, function(b) {
					switch (b.index) {
						case 0:
							break;
						case 1:
							getImage();
							break;
						case 2:
							galleryImg();
							break;
						default:
							break
					}
				})
			}

		});
//		拍照获取
		function getImage() {
			var c = plus.camera.getCamera();
			c.captureImage(function(e) {
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var s = entry.toLocalURL() + "?version=" + new Date().getTime();
					console.log(s);
					document.getElementById("head-img").src = s;
					//变更大图预览的src
					//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
					document.querySelector("#__mui-imageview__group .mui-slider-item img").src = s + "?version=" + new Date().getTime();;;
				}, function(e) {
					console.log("读取拍照文件错误：" + e.message);
				});
			}, function(s) {
				console.log("error" + s);
			}, {
				filename: "_doc/head.jpg"
			})
		}
//		从相册中选取图片
		function galleryImg() {
			plus.gallery.pick(function(a) {
				plus.io.resolveLocalFileSystemURL(a, function(entry) {
					plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
						root.getFile("head.jpg", {}, function(file) {
							//文件已存在
							file.remove(function() {
								console.log("file remove success");
								entry.copyTo(root, 'head.jpg', function(e) {
										var e = e.fullPath + "?version=" + new Date().getTime();
										document.getElementById("head-img").src = e;
										//变更大图预览的src
										//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
										document.querySelector("#__mui-imageview__group .mui-slider-item img").src = e + "?version=" + new Date().getTime();;
									},
									function(e) {
										console.log('copy image fail:' + e.message);
									});
							}, function() {
								console.log("delete image fail:" + e.message);
							});
						}, function() {
							//文件不存在
							entry.copyTo(root, 'head.jpg', function(e) {
									var path = e.fullPath + "?version=" + new Date().getTime();
									document.getElementById("head-img").src = path;
									//变更大图预览的src
									//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
									document.querySelector("#__mui-imageview__group .mui-slider-item img").src = path;
								},
								function(e) {
									console.log('copy image fail:' + e.message);
								});
						});
					}, function(e) {
						console.log("get _www folder fail");
					})
				}, function(e) {
					console.log("读取拍照文件错误：" + e.message);
				});
			}, function(a) {}, {
				filter: "image"
			})
		};

		function initImgPreview() {
			var imgs = document.querySelectorAll("img.mui-action-preview");
			imgs = mui.slice.call(imgs);
			if (imgs && imgs.length > 0) {
				var slider = document.createElement("div");
				slider.setAttribute("id", "__mui-imageview__");
				slider.classList.add("mui-slider");
				slider.classList.add("mui-fullscreen");
				slider.style.display = "none";
				slider.addEventListener("tap", function() {
					slider.style.display = "none";
				});
				slider.addEventListener("touchmove", function(event) {
					event.preventDefault();
				})
				var slider_group = document.createElement("div");
				slider_group.setAttribute("id", "__mui-imageview__group");
				slider_group.classList.add("mui-slider-group");
				imgs.forEach(function(value, index, array) {
					//给图片添加点击事件，触发预览显示；
					value.addEventListener('tap', function() {
						slider.style.display = "block";
						_slider.refresh();
						_slider.gotoItem(index, 0);
					})
					var item = document.createElement("div");
					item.classList.add("mui-slider-item");
					var a = document.createElement("a");
					var img = document.createElement("img");
					img.setAttribute("src", value.src);
					a.appendChild(img)
					item.appendChild(a);
					slider_group.appendChild(item);
				});
				slider.appendChild(slider_group);
				document.body.appendChild(slider);
				var _slider = mui(slider).slider();
			}
		}
		//

		function defaultImg() {
			if (mui.os.plus) {
				plus.io.resolveLocalFileSystemURL("_doc/head.jpg", function(entry) {
					var s = entry.fullPath + "?version=" + new Date().getTime();;
					document.getElementById("head-img").src = s;
				}, function(e) {
					document.getElementById("head-img").src = '../images/logo.png';
				})
			} else {
				document.getElementById("head-img").src = '../images/logo.png';
			}

		}
		mui.plusReady(function() {
				defaultImg();
				setTimeout(function() {
					initImgPreview();
				}, 10)
			})
			//			setTimeout(function() {
			//				defaultImg();
			//				setTimeout(function() {
			//					initImgPreview();
			//				}, 100);
			//			}, 200);