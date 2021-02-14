		var ConversionFunctions = {
			// Yatay çizim görüntüleri için görüntüyü bir dize olarak çıktı alır
			horizontal1bit: function (data, canvasWidth, canvasHeight) {
				var output_string = "";
				var output_index = 0;

				var byteIndex = 7;
				var number = 0;

				// format RGBA'dır, bu nedenle piksel başına 4 adım ilerler
				for (var index = 0; index < data.length; index += 4) {
					// RGB'nin ortalamasını alır (A'yı yok sayıyoruz)
					var avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
					if (avg > settings["threshold"]) {
						number += Math.pow(2, byteIndex);
					}
					byteIndex--;

					// eğer bu bir satırın son pikseli veya son pikseli ise
					// resim, baytımızın geri kalanını sıfırlarla doldurun, böylece her zaman 8 bit içerir
					if ((index != 0 && (((index / 4) + 1) % (canvasWidth)) == 0) || (index == data.length - 4)) {
						// for(var i=byteIndex;i>-1;i--){
						// number += Math.pow(2, i);
						// }
						byteIndex = -1;
					}

					// 8 bitin tamamına sahip olduğumuzda, bunları bir onaltılık değerde birleştirin
					if (byteIndex < 0) {
						var byteSet = number.toString(16);
						if (byteSet.length == 1) {
							byteSet = "0" + byteSet;
						}
						var b = "0x" + byteSet;
						output_string += b + ", ";
						output_index++;
						if (output_index >= 16) {
							output_string += "\n";
							output_index = 0;
						}
						number = 0;
						byteIndex = 7;
					}
				}
				return output_string;
			},


			// Dikey çizim görüntüleri için görüntüyü bir dize olarak çıktılar
			vertical1bit: function (data, canvasWidth, canvasHeight) {
				var output_string = "";
				var output_index = 0;

				for (var p = 0; p < Math.ceil(settings["screenHeight"] / 8); p++) {
					for (var x = 0; x < settings["screenWidth"]; x++) {
						var byteIndex = 7;
						var number = 0;

						for (var y = 7; y >= 0; y--) {
							var index = ((p * 8) + y) * (settings["screenWidth"] * 4) + x * 4;
							var avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
							if (avg > settings["threshold"]) {
								number += Math.pow(2, byteIndex);
							}
							byteIndex--;
						}
						var byteSet = number.toString(16);
						if (byteSet.length == 1) {
							byteSet = "0" + byteSet;
						}
						var b = "0x" + byteSet.toString(16);
						output_string += b + ", ";
						output_index++;
						if (output_index >= 16) {
							output_string += "\n";
							output_index = 0;
						}
					}
				}
				return output_string;
			},

			// Görüntüyü 565 ekran için dize olarak (yatay olarak) çıkarır
			horizontal565: function (data, canvasWidth, canvasHeight) {
				var output_string = "";
				var output_index = 0;

				// format RGBA'dır, bu nedenle piksel başına 4 adım ilerler
				for (var index = 0; index < data.length; index += 4) {
					// RGB değerlerini alır
					var r = data[index];
					var g = data[index + 1];
					var b = data[index + 2];
					// 565 renk değerini hesaplar
					var rgb = ((r & 0b11111000) << 8) | ((g & 0b11111100) << 3) | ((b & 0b11111000) >> 3);
					// Renk değerini iki bayta böler
					var firstByte = (rgb >> 8) & 0xff;
					var secondByte = rgb & 0xff;

					var byteSet = rgb.toString(16);
					while (byteSet.length < 4) {
						byteSet = "0" + byteSet;
					}
					output_string += "0x" + byteSet + ", ";

					// her 16 baytta yeni satır ekler
					output_index++;
					if (output_index >= 16) {
						output_string += "\n";
						output_index = 0;
					}
				}
				return output_string;
			},
			// Görüntüyü rgb888 ekranlar için bir dize olarak çıktı (yatay olarak)
			horizontal888: function (data, canvasWidth, canvasHeight) {
				var output_string = "";
				var output_index = 0;

				// format RGBA'dır, bu nedenle piksel başına 4 adım ilerler
				for (var index = 0; index < data.length; index += 4) {
					// RGB değerlerini alın
					var r = data[index];
					var g = data[index + 1];
					var b = data[index + 2];
					// 565 renk değerini hesapla
					var rgb = (r << 16) | (g << 8) | (b);
					// Renk değerini iki bayta böler
					var firstByte = (rgb >> 8) & 0xff;
					var secondByte = rgb & 0xff;

					var byteSet = rgb.toString(16);
					while (byteSet.length < 8) {
						byteSet = "0" + byteSet;
					}
					output_string += "0x" + byteSet + ", ";

					// her 16 baytta yeni satır ekler
					output_index++;
					if (output_index >= canvasWidth) {
						output_string += "\n";
						output_index = 0;
					}
				}
				return output_string;
			},
			// Yatay çizim ekranları için alfa maskesini bir dize olarak çıktılar
			horizontalAlpha: function (data, canvasWidth, canvasHeight) {
				var output_string = "";
				var output_index = 0;

				var byteIndex = 7;
				var number = 0;

				// format RGBA'dır, bu nedenle piksel başına 4 adım ilerler
				for (var index = 0; index < data.length; index += 4) {
					// Görüntü verilerinin alfa kısmını alır
					var alpha = data[index + 3];
					if (alpha > settings["threshold"]) {
						number += Math.pow(2, byteIndex);
					}
					byteIndex--;

					// eğer bu bir satırın son pikseli veya son pikseli ise
					// resim, baytımızın geri kalanını sıfırlarla doldurun, böylece her zaman 8 bit içerir
					if ((index != 0 && (((index / 4) + 1) % (canvasWidth)) == 0) || (index == data.length - 4)) {
						byteIndex = -1;
					}

					// 8 bitin tamamına sahip olduğumuzda, bunları bir onaltılık değerde birleştirin
					if (byteIndex < 0) {
						var byteSet = number.toString(16);
						if (byteSet.length == 1) {
							byteSet = "0" + byteSet;
						}
						var b = "0x" + byteSet;
						output_string += b + ", ";
						output_index++;
						if (output_index >= 16) {
							output_string += "\n";
							output_index = 0;
						}
						number = 0;
						byteIndex = 7;
					}
				}
				return output_string;
			}
		};

		// Yardımcı yöntemlerle bir görüntü koleksiyonu
		function Images() {
			var collection = [];
			this.push = function (img, canvas, glyph) {
				collection.push({
					"img": img,
					"canvas": canvas,
					"glyph": glyph
				});
			};
			this.remove = function (image) {
				var i = collection.indexOf(image);
				if (i != -1) collection.splice(i, 1);
			};
			this.each = function (f) {
				collection.forEach(f);
			};
			this.length = function () {
				return collection.length;
			};
			this.first = function () {
				return collection[0];
			};
			this.last = function () {
				return collection[collection.length - 1];
			};
			this.getByIndex = function (index) {
				return collection[index];
			};
			this.setByIndex = function (index, img) {
				collection[index] = img;
			};
			this.get = function (img) {
				if (img) {
					for (var i = 0; i < collection.length; i++) {
						if (collection[i].img == img) {
							return collection[i];
						}
					}
				}
				return collection;
			};
			return this;
		}

		// Dosya giriş düğmesine olay ekle
		var fileInput = document.getElementById("file-input");
		fileInput.addEventListener("click", function () {
			this.value = null;
		}, false);
		fileInput.addEventListener("change", handleImageSelection, false);

		// Dosya seçici tarafından kabul edilen dosya türleri
		var fileTypes = ["jpg", "jpeg", "png", "bmp", "gif", "svg"];

		// Üzerine çizeceğimiz tuval
		var canvasContainer = document.getElementById("images-canvas-container");
		// çoklu görüntü ayarları kapsayıcısı
		var imageSizeSettings = document.getElementById("image-size-settings");
		// tüm resimler aynı boyutta düğme
		var allSameSizeButton = document.getElementById("all-same-size");
		// hata mesajı
		var onlyImagesFileError = document.getElementById("only-images-file-error");
		// ilk mesaj
		var noFileSelected = document.getElementById("no-file-selected");

		// Görüntülerimizi tutan değişken. Küresel olduğundan, kolayca yeniden kullanabiliriz.
		// kullanıcı ayarları günceller (tuval boyutunu değiştir, ölçek, ters çevir, vb.)
		var images = new Images();

		// Dönüştürürken kullanılan bir dizi ayar
		var settings = {
			screenWidth: 128,
			screenHeight: 64,
			scaleToFit: true,
			preserveRatio: true,
			centerHorizontally: false,
			centerVertically: false,
			backgroundColor: "white",
			scale: "1",
			drawMode: "horizontal",
			threshold: 128,
			outputFormat: "plain",
			invertColors: false,
			rotate180: false,
			conversionFunction: ConversionFunctions.horizontal1bit
		};

		// Değişken adı, "arduino kodu" gerektiğinde
		var identifier = "myBitmap";

		function update() {
			images.each(function (image) {
				place_image(image);
			});
		}

		// Bir metin alanı tarafından kontrol edilen ayarları güncellemenin kolay yolu
		function updateInteger(fieldName) {
			settings[fieldName] = document.getElementById(fieldName).value;
			update();
		}

		// Bir onay kutusu tarafından kontrol edilen ayarları güncellemenin kolay yolu
		function updateBoolean(fieldName) {
			settings[fieldName] = document.getElementById(fieldName).checked;
			update();
		}

		// Bir radyo düğmesi ile kontrol edilen ayarları güncellemenin kolay yolu
		function updateRadio(fieldName) {
			var radioGroup = document.getElementsByName(fieldName);
			for (var i = 0; i < radioGroup.length; i++) {
				if (radioGroup[i].checked) {
					settings[fieldName] = radioGroup[i].value;
				}
			}
			update();
		}

		// Arduino kodunu günceller onay kutusu
		function updateOutputFormat(elm) {

			var caption = document.getElementById("format-caption-container");
			var adafruitGfx = document.getElementById("adafruit-gfx-settings");
			var arduino = document.getElementById("arduino-identifier");

			for (var i = 0; i < caption.children.length; i++) {
				caption.children[i].style.display = "none";
			}
			caption = document.querySelector("div[data-caption='" + elm.value + "']");
			if (caption) caption.style.display = "block";

			elm.value != "plain" ? arduino.style.display = "block" : arduino.style.display = "none";
			elm.value == "adafruit_gfx" ? adafruitGfx.style.display = "block" : adafruitGfx.style.display = "none";

			settings["outputFormat"] = elm.value;
		}

		function updateDrawMode(elm) {
			var note = document.getElementById("note1bit");
			if (elm.value == "horizontal1bit" || elm.value == "vertical1bit") {
				note.style.display = "block";
			} else {
				note.style.display = "none";
			}

			var conversionFunction = ConversionFunctions[elm.value];
			if (conversionFunction) {
				settings.conversionFunction = conversionFunction;
			}
		}

		function updateDrawMode(elm) {
			var note = document.getElementById("note1bit");
			if (elm.value == "horizontal1bit" || elm.value == "vertical1bit") {
				note.style.display = "block";
			} else {
				note.style.display = "none";
			}

			var conversionFunction = ConversionFunctions[elm.value];
			if (conversionFunction) {
				settings.conversionFunction = conversionFunction;
			}
		}

		// Tuvali siyah beyaz yapar
		function blackAndWhite(canvas, ctx) {
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imageData.data;
			for (var i = 0; i < data.length; i += 4) {
				var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
				avg > settings["threshold"] ? avg = 255 : avg = 0;
				data[i] = avg; // kırmızı
				data[i + 1] = avg; // yeşil
				data[i + 2] = avg; // mavi
			}
			ctx.putImageData(imageData, 0, 0);
		}


		// Tuvalin renklerini ters çevirir
		function invert(canvas, ctx) {
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imageData.data;
			for (var i = 0; i < data.length; i += 4) {
				data[i] = 255 - data[i]; // kırmızı
				data[i + 1] = 255 - data[i + 1]; // yeşil
				data[i + 2] = 255 - data[i + 2]; // mavi
			}
			ctx.putImageData(imageData, 0, 0);
		}

		// Rengi ve ölçeklemeyi hesaba katarak resmi tuval üzerine çizin
		function place_image(image) {

			var img = image.img;
			var canvas = image.canvas;
			var ctx = canvas.getContext("2d");
			image.ctx = ctx;

			// Doğru tuval boyutunu kullandığımızdan emin olun
			//canvas.width = settings["screenWidth"];
			//canvas.height = settings["screenHeight"];

			// Gerekirse arka planı ters çevirin
			if (settings["backgroundColor"] == "transparent") {
				ctx.fillStyle = "rgba(0,0,0,0.0)";
				ctx.globalCompositeOperation = 'copy';
			} else {
				if (settings["invertColors"]) {
					settings["backgroundColor"] == "white" ? ctx.fillStyle = "black" : ctx.fillStyle = "white";
				} else {
					ctx.fillStyle = settings["backgroundColor"];
				}
				ctx.globalCompositeOperation = 'source-over';
			}
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.setTransform(1, 0, 0, 1, 0, 0); // kimlik matrisi dönüşümü ile başlayın (döndürme yok).
			if (settings["rotate180"]) {
				// Matris dönüşümü
				ctx.translate(canvas.width / 2.0, canvas.height / 2.0);
				ctx.rotate(Math.PI);
				ctx.translate(-canvas.width / 2.0, -canvas.height / 2.0);
			}

			// İstendiğinde görüntüyü ortalamak için ofset kullanılır
			var offset_x = 0;
			var offset_y = 0;

			switch (settings["scale"]) {
				case "1": // Orijinal
					if (settings["centerHorizontally"]) {
						offset_x = Math.round((canvas.width - img.width) / 2);
					}
					if (settings["centerVertically"]) {
						offset_y = Math.round((canvas.height - img.height) / 2);
					}
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, img.width, img.height);
					break;
				case "2": // Sığdır (oranı değiştirmeden mümkün olduğunca büyük yapın)
					var horRatio = canvas.width / img.width;
					var verRatio = canvas.height / img.height;
					var useRatio = Math.min(horRatio, verRatio);

					if (settings["centerHorizontally"]) {
						offset_x = Math.round((canvas.width - img.width * useRatio) / 2);
					}
					if (settings["centerVertically"]) {
						offset_y = Math.round((canvas.height - img.height * useRatio) / 2);
					}
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, img.width * useRatio, img.height * useRatio);
					break;
				case "3": // x+y (oranı korumadan mümkün olduğunca büyük yapın)
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, canvas.width, canvas.height);
					break;
				case "4": // x (olabildiğince geniş yapın)
					offset_x = 0;
					if (settings["centerVertically"]) {
						Math.round(offset_y = (canvas.height - img.height) / 2);
					}
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, canvas.width, img.height);
					break;
				case "5": // y (olabildiğince uzun yapın)
					if (settings["centerHorizontally"]) {
						offset_x = Math.round((canvas.width - img.width) / 2);
					}
					offset_y = 0;
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, img.width, canvas.height);
					break;
			}
			// Görüntünün siyah beyaz olduğundan emin olun
			if (settings.conversionFunction == ConversionFunctions.horizontal1bit ||
				settings.conversionFunction == ConversionFunctions.vertical1bit) {
				blackAndWhite(canvas, ctx);
				if (settings["invertColors"]) {
					invert(canvas, ctx);
				}
			}
		}


		// Kodu yapıştırarak görüntü eklemeyi yönetin
		function handleTextInput(drawMode) {

			var canvas = document.createElement("canvas");
			canvas.width = parseInt(document.getElementById("text-input-width").value);
			canvas.height = parseInt(document.getElementById("text-input-height").value);
			settings["screenWidth"] = canvas.width;
			settings["screenHeight"] = canvas.height;

			if (canvasContainer.children.length) {
				canvasContainer.removeChild(canvasContainer.firstChild);
			}
			canvasContainer.appendChild(canvas);

			var image = new Image();
			images.setByIndex(0, {
				"img": image,
				"canvas": canvas
			});

			var input = document.getElementById("byte-input").value;

			// Arduino kodunu kaldır
			input = input.replace(/const unsigned char myBitmap \[\] PROGMEM = \{/g, "");
			input = input.replace(/\};/g, "");

			// Yeni satırları virgüllere dönüştür (yorumların daha sonra kaldırılmasına yardımcı olur)
			input = input.replace(/\r\n|\r|\n/g, ",");
			// Bir satırdaki birden çok virgülü tek bir virgül haline dönüştürün
			input = input.replace(/,{2,}/g, ",");
			// Boşluğu kaldır
			input = input.replace(/\s/g, "");
			// Yorumları kaldır
			input = input.replace(/\/\/(.+?),/g, "");
			// "0x" kaldır
			input = input.replace(/0x/g, "");
			// Listeye böl
			var list = input.split(",");
			console.log(list);

			if (drawMode == "horizontal") {
				listToImageHorizontal(list, canvas);
			} else {
				listToImageVertical(list, canvas);
			}
		}


		function allSameSize(images, files) {
			if (images.length() > 1 && images.length() == files.length) {
				var inputs = imageSizeSettings.querySelectorAll("input");
				allSameSizeButton.onclick = function () {
					for (var i = 2; i < inputs.length; i++) {
						if (inputs[i].name == "width") {
							inputs[i].value = inputs[0].value;
							inputs[i].oninput();
						}
						if (inputs[i].name == "height") {
							inputs[i].value = inputs[1].value;
							inputs[i].oninput();
						}

					}
				};
				allSameSizeButton.style.display = "block";
			}
		}

		// Dosya seçici ile bir görüntü seçme işlemini gerçekleştirir.
		function handleImageSelection(evt) {

			var files = evt.target.files;
			onlyImagesFileError.style.display = "none";

			files.length > 0 ?
				noFileSelected.style.display = "none" :
				noFileSelected.style.display = "block";

			for (var i = 0, f; f = files[i]; i++) {

				// Yalnızca görüntü dosyalarını işler.
				if (!f.type.match("image.*")) {
					onlyImagesFileError.style.display = "block";
					continue;
				}

				var reader = new FileReader();

				reader.onload = (function (file) {
					return function (e) {
						// Küçük resmi işler.
						var img = new Image();

						img.onload = function () {

							var canvas = document.createElement("canvas");

							var imageEntry = document.createElement("li");
							imageEntry.setAttribute("data-img", file.name);

							var w = document.createElement("input");
							w.type = "number";
							w.name = "width";
							w.id = "screenWidth";
							w.min = 0;
							w.className = "size-input";
							w.value = img.width;
							settings["screenWidth"] = img.width;
							w.oninput = function () {
								canvas.width = this.value;
								update();
								updateInteger('screenWidth');
							};

							var h = document.createElement("input");
							h.type = "number";
							h.name = "height";
							h.id = "screenHeight";
							h.min = 0;
							h.className = "size-input";
							h.value = img.height;
							settings["screenHeight"] = img.height;
							h.oninput = function () {
								canvas.height = this.value;
								update();
								updateInteger('screenHeight');
							};

							var gil = document.createElement("span");
							gil.innerHTML = "glyph";
							gil.className = "file-info";

							var gi = document.createElement("input");
							gi.type = "text";
							gi.name = "glyph";
							gi.className = "glyph-input";
							gi.onchange = function () {
								var image = images.get(img);
								image.glyph = gi.value;
							};

							var fn = document.createElement("span");
							fn.className = "file-info";
							fn.innerHTML = file.name + "  (dosya çözünürlüğü: " + img.width + " x " + img
								.height + ")";
							fn.innerHTML += "<br />";

							var rb = document.createElement("button");
							rb.className = "remove-button";
							rb.innerHTML = "Kaldır";
							rb.onclick = function () {
								var image = images.get(img);
								canvasContainer.removeChild(image.canvas);
								images.remove(image);
								imageSizeSettings.removeChild(imageEntry);
								if (imageSizeSettings.children.length == 1) {
									allSameSizeButton.style.display = "none";
								}
								if (images.length() == 0) noFileSelected.style.display = "block";
								update();
							};

							imageEntry.appendChild(fn);
							imageEntry.appendChild(w);
							imageEntry.appendChild(document.createTextNode(" x "));
							imageEntry.appendChild(h);
							imageEntry.appendChild(gil);
							imageEntry.appendChild(gi);
							imageEntry.appendChild(rb);

							imageSizeSettings.appendChild(imageEntry);

							canvas.width = img.width;
							canvas.height = img.height;
							canvasContainer.appendChild(canvas);

							images.push(img, canvas, file.name.split(".")[0]);
							place_image(images.last());
							allSameSize(images, files);
						};
						img.src = e.target.result;
					};
				})(f);
				reader.readAsDataURL(f);
			}
		}

		function imageToString(image) {
			// ham görüntü verilerini çıkar
			var ctx = image.ctx;
			var canvas = image.canvas;

			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imageData.data;
			return settings.conversionFunction(data, canvas.width, canvas.height);
		}

		// Varsa, özel arduino çıktı değişken adını alın
		function getIdentifier() {
			var vn = document.getElementById("identifier");
			return vn && vn.value.length ? vn.value : identifier;
		}


		// Görüntü dizesini metin alanına çıktılar
		function outputString() {

			var output_string = "",
				count = 1;
			var code = "";

			switch (settings["outputFormat"]) {

				case "arduino": {

					images.each(function (image) {
						code = imageToString(image);

						// Boşluğu uçtan kırpın ve sondaki virgülü kaldırın
						code = code.replace(/,\s*$/, "");

						code = "\t" + code.split("\n").join("\n\t") + "\n";
						var variableCount = images.length() > 1 ? count++ : "";
						var comment = "// '" + image.glyph + "', " + image.canvas.width + "x" + image.canvas.height +
							"px\n";

						code = comment + "const " + getType() + " " +
							getIdentifier() +
							variableCount +
							" [] PROGMEM = {" +
							"\n" + code + "};\n";

						output_string += code;
					});
					break;
				}

				case "arduino_single": {
					var comment = "";
					images.each(function (image) {
						code = imageToString(image);
						code = "\t" + code.split("\n").join("\n\t") + "\n";
						comment = "\t// '" + image.glyph + ", " + image.canvas.width + "x" + image.canvas.height +
							"px\n";
						output_string += comment + code;
					});

					output_string = output_string.replace(/,\s*$/, "");

					output_string = "const " + getType() + " " +
						+getIdentifier() +
						" [] PROGMEM = {" +
						"\n" + output_string + "\n};";
					break;
				}

				case "adafruit_gfx": { // bitmap
					var comment = "";
					var useGlyphs = 0;
					images.each(function (image) {
						code = imageToString(image);
						code = "\t" + code.split("\n").join("\n\t") + "\n";
						comment = "\t// '" + image.glyph + ", " + image.canvas.width + "x" + image.canvas.height +
							"px\n";
						output_string += comment + code;
						if (image.glyph.length == 1) useGlyphs++;
					});

					output_string = output_string.replace(/,\s*$/, "");
					output_string = "const unsigned char " +
						getIdentifier() +
						"Bitmap" +
						" [] PROGMEM = {" +
						"\n" + output_string + "\n};\n\n" +
						"const GFXbitmapGlyph " +
						getIdentifier() +
						"Glyphs [] PROGMEM = {\n";

					var firstAschiiChar = document.getElementById("first-ascii-char").value;
					var xAdvance = parseInt(document.getElementById("x-advance").value);
					var offset = 0;
					code = "";

					// GFXbitmapGlyph
					images.each(function (image) {
						code += "\t{ " +
							offset + ", " +
							image.canvas.width + ", " +
							image.canvas.height + ", " +
							xAdvance + ", " +
							"'" + (images.length() == useGlyphs ?
								image.glyph :
								String.fromCharCode(firstAschiiChar++)) + "'" +
							" }";
						if (image != images.last()) {
							code += ",";
						}
						code += "// '" + image.glyph + "'\n";
						offset += image.canvas.width;
					});
					code += "};\n";
					output_string += code;

					// GFXbitmapFont
					output_string += "\nconst GFXbitmapFont " +
						getIdentifier() +
						"Font PROGMEM = {\n" +
						"\t(uint8_t *)" +
						getIdentifier() + "Bitmap,\n" +
						"\t(GFXbitmapGlyph *)" +
						getIdentifier() +
						"Glyphs,\n" +
						"\t" + images.length() +
						"\n};\n";
					break;
				}
				default: { // plain
					images.each(function (image) {
						code = imageToString(image);
						var comment = image.glyph ? ("// '" + image.glyph + "', " + image.canvas.width + "x" + image
							.canvas.height + "px\n") : "";
						if (image.img != images.first().img) comment = "\n" + comment;
						code = comment + code;
						output_string += code;
					});
					// Boşluğu uçtan kırpın ve sondaki virgülü kaldırın
					output_string = output_string.replace(/,\s*$/g, "");
				}
			}

			document.getElementById("code-output").value = output_string;
		}

		// Resmi çizmek için yatay yönelimli listeyi kullanın
		function listToImageHorizontal(list, canvas) {

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var imgData = ctx.createImageData(canvas.width, canvas.height);

			var index = 0;

			var page = 0;
			var x = 0;
			var y = 7;
			// genişliği bir sonraki bayta kadar yuvarla
			var widthRoundedUp = Math.floor(canvas.width / 8 + (canvas.width % 8 ? 1 : 0)) * 8;
			var widthCounter = 0;

			// Listeyi imageData nesnesine taşıyın
			for (var i = 0; i < list.length; i++) {

				var binString = hexToBinary(list[i]);
				if (!binString.valid) {
					alert(
						"Dize dönüştürülürken bir sorun oluştu. Bayt dizisi girişinden herhangi bir yorumu veya metin yazısını kaldırmayı unuttunuz mu?"
					);
					console.log("Geçersiz hexToBinary: ", binString.s);
					return;
				}
				binString = binString.result;
				if (binString.length == 4) {
					binString = binString + "0000";
				}

				// Pikselin beyaz mı yoksa siyah mı olduğunu kontrol edin
				for (var k = 0; k < binString.length; k++, widthCounter++) {
					// yeterince bit sayarsak, sayacı sonraki satır için sıfırla
					if (widthCounter >= widthRoundedUp) {
						widthCounter = 0;
					}
					// bir bayta yuvarlama nedeniyle 'artefakt' piksellerini atla
					if (widthCounter >= canvas.width) {
						continue;
					}
					var color = 0;
					if (binString.charAt(k) == "1") {
						color = 255;
					}
					imgData.data[index] = color;
					imgData.data[index + 1] = color;
					imgData.data[index + 2] = color;
					imgData.data[index + 3] = 255;

					index += 4;
				}
			}

			// Resmi tuvale çizin, ardından tuval içeriğini kaydedin
			// img nesnesinin içinde. Bu şekilde img nesnesini ne zaman yeniden kullanabiliriz?
			// ölçeklemek / ters çevirmek vb. istiyoruz
			ctx.putImageData(imgData, 0, 0);
			var img = new Image();
			img.src = canvas.toDataURL("image/png");
			images.first().img = img;
		}


		// Resmi çizmek için dikey yönelimli listeyi kullanın
		function listToImageVertical(list, canvas) {

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var index = 0;

			var page = 0;
			var x = 0;
			var y = 7;

			// Listeyi imageData nesnesine taşıyın
			for (var i = 0; i < list.length; i++) {

				var binString = hexToBinary(list[i]);
				if (!binString.valid) {
					alert(
						"Dize dönüştürülürken bir sorun oluştu. Bayt dizisi girişinden herhangi bir yorumu kaldırmayı unuttunuz mu?"
					);
					console.log("Geçersiz hexToBinary: ", binString.s);
					return;
				}
				binString = binString.result;
				if (binString.length == 4) {
					binString = binString + "0000";
				}

				// Pikselin beyaz mı yoksa siyah mı olduğunu kontrol edin
				for (var k = 0; k < binString.length; k++) {
					var color = 0;
					if (binString.charAt(k) == "1") {
						color = 255;
					}
					drawPixel(ctx, x, (page * 8) + y, color);
					y--;
					if (y < 0) {
						y = 7;
						x++;
						if (x >= settings["screenWidth"]) {
							x = 0;
							page++;
						}
					}

				}
			}
			// Tuval içeriğini img nesnesinin içine kaydedin. Bu şekilde yapabiliriz
			// ölçeklemek / ters çevirmek vb. istediğimizde img nesnesini yeniden kullan
			var img = new Image();
			img.src = canvas.toDataURL("image/png");
			images.first().img = img;
		}


		// Hex'i ikiliye dönüştür
		function hexToBinary(s) {

			var i, k, part, ret = "";
			// Daha kolay dönüştürme için arama tablosu. "0" karakter
			// "1" ila "7" için
			var lookupTable = {
				"0": "0000",
				"1": "0001",
				"2": "0010",
				"3": "0011",
				"4": "0100",
				"5": "0101",
				"6": "0110",
				"7": "0111",
				"8": "1000",
				"9": "1001",
				"a": "1010",
				"b": "1011",
				"c": "1100",
				"d": "1101",
				"e": "1110",
				"f": "1111",
				"A": "1010",
				"B": "1011",
				"C": "1100",
				"D": "1101",
				"E": "1110",
				"F": "1111"
			};
			for (i = 0; i < s.length; i += 1) {
				if (lookupTable.hasOwnProperty(s[i])) {
					ret += lookupTable[s[i]];
				} else {
					return {
						valid: false,
						s: s
					};
				}
			}
			return {
				valid: true,
				result: ret
			};
		}


		// Tuvale tek pikseller çizmenin hızlı ve etkili yolu
		// küresel 1x1 piksel büyük bir tuval kullanarak
		function drawPixel(ctx, x, y, color) {
			var single_pixel = ctx.createImageData(1, 1);
			var d = single_pixel.data;

			d[0] = color;
			d[1] = color;
			d[2] = color;
			d[3] = 255;
			ctx.putImageData(single_pixel, x, y);
		}
		// Çıktı görüntüsünün türünü (arduino kodunda) alın
		// Bu biraz hack'tir, bunu dönüştürme işlevinin bir özelliği yapmak daha iyidir (muhtemelen onu nesnelere dönüştürmelisiniz)
		function getType() {
			if (settings.conversionFunction == ConversionFunctions.horizontal565) {
				return "uint16_t";
			} else if (settings.conversionFunction == ConversionFunctions.horizontal888) {
				return "unsigned long";
			} else {
				return "unsigned char";
			}
		}
		document.getElementById("outputFormat").value = "arduino";
		document.getElementById("outputFormat").onchange();