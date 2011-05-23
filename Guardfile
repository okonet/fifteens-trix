guard 'coffeescript', :input => 'app', :output => 'js'

guard 'compass' do
  watch(/app\/stylesheets\/(.*)\.s[ac]ss/)
end

guard 'livereload' do
  watch(%r{^assets/.+\.js})
  watch(%r{^assets/.+\.css})
end
