guard 'coffeescript', :input => 'app', :output => 'public/js'

guard 'compass' do
  watch(/app\/stylesheets\/(.*)\.s[ac]ss/)
end

# guard 'livereload' do
#   watch(%r{^assets\/(.*)\.js})
#   watch(%r{^assets\/(.*)\.css})
# end

guard 'jammit' do
  watch(%r{^public/js/(.*)\.js})
  watch(%r{^public/css/(.*)\.css})
end