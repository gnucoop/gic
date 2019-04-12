pushd ../../..

# Build core
pushd core
yarn run build
yarn link
popd

# Build angular
pushd angular
yarn link @gic/core
yarn run build
popd

popd
