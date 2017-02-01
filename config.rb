activate :i18n, mount_at_root: :en

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  blog.prefix = "blog"
  blog.name = "blog"
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
activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  blog.prefix = "sandiego-maps"
  blog.name = "sandiego-maps"
  blog.layout = "sd-article"

  blog.permalink = "{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  blog.sources = "{year}-{month}-{day}-{title}.html"
end

page "/feed.xml", layout: false

configure :development do
  activate :livereload
end

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

end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

configure :build do
  ignore '*.swp'
  activate :relative_assets
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
  deploy.branch = "master"
  deploy.commit_message = 'Site updated to ' << `git log --pretty="%h" -n1`
end
