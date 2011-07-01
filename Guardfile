guard 'coffeescript', :input => 'app', :output => 'public/js'

guard 'compass' do
  watch(/app\/stylesheets\/(.*)\.s[ac]ss/)
end

guard 'jammit' do
  watch(%r{^public/js/(.*)\.js})
  watch(%r{^public/css/(.*)\.css})
end

guard 'livereload' do
  watch(%r{^public/assets\/(.*)\.js})
  watch(%r{^public/assets\/(.*)\.css})
end
