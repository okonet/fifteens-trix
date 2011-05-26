require 'sinatra'
require 'erb'

class Application < Sinatra::Base

  set :public, "#{File.dirname(__FILE__)}/public"
  set :views, "#{File.dirname(__FILE__)}/templates"
  
  configure do
    mime_type :manifest, 'text/cache-manifest'
  end
  
  # if settings.environment == :production
  #   raise "APP environment variable not set" if ENV['APP'].nil? || ENV['APP'].empty?
  # end
  
  get '/' do
    erb :index
  end
  
end
