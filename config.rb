activate :i18n, mount_at_root: false

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  blog.prefix = "blog"
  blog.layout = "article"

  blog.permalink = "{lang}/{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  blog.sources = "{lang}/{year}-{month}-{day}-{title}.html"
  # blog.taglink = "tags/{tag}.html"
  # blog.summary_separator = /(READMORE)/
  blog.summary_length = 150
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  # blog.default_extension = ".markdown"

  # blog.tag_template = "tag.html"
  # blog.calendar_template = "calendar.html"

  # Enable pagination
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end

page "/feed.xml", layout: false
###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (https://middlemanapp.com/advanced/dynamic_pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

# Methods defined in the helpers block are available in templates
helpers do
  def nav_active(path)
    current_page.path == path ? { class: "active "} : {}
  end

  def locale_active(locale)
    I18n.locale == locale.to_sym ? { class: "active" } : {}
  end

  def locale_path(path)
    if I18n.locale == :de
      "/#{I18n.locale.to_s}#{path}"
    else
      path
    end
  end

  def locale_dateformat
    case I18n.locale
    when :de then '%e. %b %Y'
    when :en then '%b %e %Y'
    end
  end

  def invoice_date(invoice)
    date = Date.strptime(invoice.date, '%Y-%m-%d')
    date.strftime(locale_dateformat)
  end

#   def some_helper
#     "Helping"
#   end
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

data.invoices.each do |invoice|
  proxy "/en/pay/#{invoice.code}/index.html", "pay.html", locals: { invoice: invoice }, lang: :en, ignore: true
end

ignore "/de/book/pay.html"
ignore "/en/book/pay.html"

redirect "index.html", to: "en/index.html"
redirect "blog/index.html", to: "de/blog/index.html"
redirect "blog/index.html", to: "de/blog/index.html"
redirect "legal/index.html", to: "/de/legal/index.html"
redirect "legal/privacy/index.html", to: "/de/legal/privacy/index.html"
redirect "contact/index.html", to: "/de/contact/index.html"
redirect "contact/thank-you/index.html", to: "/de/contact/thank-you/index.html"
redirect "newsletter/index.html", to: "/de/newsletter/index.html"
redirect "newsletter/thank-you/index.html", to: "/de/newsletter/thank-you/index.html"
redirect "book/index.html", to: "/de/book/index.html"

# Build-specific configuration
configure :build do
  ignore '*.swp'
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
  deploy.branch = "master"
  deploy.commit_message = 'Site updated to ' << `git log --pretty="%h" -n1`
end
