# Copy angular dist
rm -rf node_modules/@gic/angular/dist
cp -a ../../dist node_modules/@gic/angular/dist
cp -a ../../package.json node_modules/@gic/angular/package.json

# Copy core dist
rm -rf node_modules/@gic/core/dist
cp -a ../../../core/dist node_modules/@gic/core/dist
cp -a ../../../core/loader node_modules/@gic/core/loader
cp -a ../../../core/package.json node_modules/@gic/core/package.json
