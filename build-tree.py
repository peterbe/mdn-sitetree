import json
import time
import sys
import argparse
from pathlib import Path


def run(root: Path, destination: Path, cutoff=30, max_depth=5, locale=None):
    # print([root, locale, cutoff, max_depth])

    def toggled_by_default(f):
        if f.name == "en-us":
            return True
        if f.name == "web" and f.parent.name == "en-us":
            return True
        if (
            f.name == "javascript"
            and f.parent.name == "web"
            and f.parent.parent.name == "en-us"
        ):
            return True
        return False

    def get_children(root, depth=0):
        files = root.iterdir()
        children = []
        if depth <= 1:
            print("\t" * depth, root)
        for file in files:
            is_directory = file.is_dir()
            if is_directory:
                sub_children = []
                if depth < max_depth:
                    sub_children = get_children(file, depth=depth + 1)
                files_count = count_files(file)
                child = {
                    "name": f"{file.name} {files_count:,} file{'s' if files_count != 1 else ''}",
                    "count": files_count,
                }
                if toggled_by_default(file):
                    child["toggled"] = True
                if sub_children:
                    sub_children.sort(key=lambda x: x["count"], reverse=True)
                    if len(sub_children) > cutoff:
                        total_sum = sum(x["count"] for x in sub_children)
                        rest = sub_children[cutoff:]
                        sub_children = sub_children[:cutoff]
                        combined_sum = sum(x["count"] for x in rest)
                        p = 100 * combined_sum / total_sum
                        combined = {
                            "name": f"*REST* ({combined_sum:,} files {p:.1f}%)",
                            "count": combined_sum,
                        }
                        sub_children.append(combined)
                    child["children"] = sub_children
                children.append(child)
        total_sum = sum(x["count"] for x in children)
        for child in children:
            p = 100 * child["count"] / total_sum
            child["name"] = f'{child["name"]} {p:.1f}%'

        return children

    t0 = time.time()
    children = get_children(root)
    children.sort(key=lambda x: x["count"], reverse=True)

    data = {"name": "/", "toggled": True, "children": children}

    with open(destination, "w") as f:
        json.dump(data, f, indent=2)
    t1 = time.time()
    mb = destination.stat().st_size / 1024 / 1024
    print(f"Wrote {destination} ({mb:.1f}MB) took {int(t1 - t0)} seconds")


def count_files(root):
    count = 0
    files = root.iterdir()
    for file in files:
        if file.name == "index.yaml":
            count += 1
        elif file.is_dir():
            count += count_files(file)
    return count


def get_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "root", help="where's the yari content?",
    )
    parser.add_argument(
        "--locale", help="specific locale",
    )
    parser.add_argument(
        "--cutoff", help="list vs. 'rest'", type=int, default=30,
    )
    parser.add_argument(
        "--max-depth", help="how deep to go", type=int, default=5,
    )
    parser.add_argument(
        "--destination", help="where to put the result", default="public/tree.json"
    )
    return parser


def main():
    parser = get_parser()
    args = parser.parse_args()
    run(
        Path(args.root),
        Path(args.destination),
        locale=args.locale,
        cutoff=args.cutoff,
        max_depth=args.max_depth,
    )


if __name__ == "__main__":
    sys.exit(main())
