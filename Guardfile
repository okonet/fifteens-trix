guard 'coffeescript', :input => 'app', :output => 'js', :cli => ''

guard 'compass' do
  watch(/app\/stylesheets\/(.*)\.s[ac]ss/)
end

guard 'livereload', :apply_js_live => false do
  watch(%r{^public/.+\.js})
  watch(%r{^public/.+\.css})
end



